import { describe, it, expect, vi } from "vitest";

import {
  hybridSearch,
  mergeWithRRF,
  getResultKey,
  RRF_K,
  DEFAULT_LIMIT,
  PREFETCH_MULTIPLIER,
} from "./hybrid-search";
import type { SearchResult } from "../types";
import { VectorStore } from "./vector-store";

// ============================================================
// 모킹 헬퍼
// ============================================================

/** 테스트용 SearchResult를 생성한다 */
function createResult(
  overrides: Partial<SearchResult> = {}
): SearchResult {
  return {
    text: "테스트 텍스트",
    score: 0.9,
    sourceUrl: "https://example.com/test",
    sourceTitle: "테스트 제목",
    category: "blog",
    chunkIndex: 0,
    ...overrides,
  };
}

/** 모킹된 VectorStore를 생성한다 */
function createMockVectorStore(
  denseResults: SearchResult[] = [],
  sparseResults: SearchResult[] = []
): VectorStore {
  return {
    searchDense: vi.fn().mockResolvedValue(denseResults),
    searchSparse: vi.fn().mockResolvedValue(sparseResults),
  } as unknown as VectorStore;
}

/** 모킹된 임베딩 함수를 생성한다 */
function createMockEmbedFn(
  vector: number[] = Array.from({ length: 768 }, () => 0.1)
): () => Promise<number[]> {
  return vi.fn().mockResolvedValue(vector);
}

// ============================================================
// getResultKey
// ============================================================

describe("getResultKey", () => {
  it("text와 sourceUrl을 조합하여 고유 키를 생성한다", () => {
    const result = createResult({
      text: "안녕하세요",
      sourceUrl: "https://example.com/hello",
    });

    const key = getResultKey(result);

    expect(key).toBe("안녕하세요::https://example.com/hello");
  });

  it("동일한 text와 sourceUrl은 같은 키를 생성한다", () => {
    const result1 = createResult({
      text: "동일 텍스트",
      sourceUrl: "https://example.com/same",
      score: 0.9,
    });
    const result2 = createResult({
      text: "동일 텍스트",
      sourceUrl: "https://example.com/same",
      score: 0.5,
    });

    expect(getResultKey(result1)).toBe(getResultKey(result2));
  });

  it("다른 text는 다른 키를 생성한다", () => {
    const result1 = createResult({ text: "텍스트 A" });
    const result2 = createResult({ text: "텍스트 B" });

    expect(getResultKey(result1)).not.toBe(getResultKey(result2));
  });
});

// ============================================================
// mergeWithRRF
// ============================================================

describe("mergeWithRRF", () => {
  it("두 검색 결과를 RRF 점수로 병합한다", () => {
    const denseResults = [
      createResult({ text: "A", sourceUrl: "https://a.com" }),
      createResult({ text: "B", sourceUrl: "https://b.com" }),
    ];
    const sparseResults = [
      createResult({ text: "B", sourceUrl: "https://b.com" }),
      createResult({ text: "C", sourceUrl: "https://c.com" }),
    ];

    const merged = mergeWithRRF(denseResults, sparseResults, 10);

    // B는 양쪽 모두에 있으므로 가장 높은 RRF 점수를 가져야 한다
    expect(merged[0].text).toBe("B");
    expect(merged[0].sourceUrl).toBe("https://b.com");
  });

  it("양쪽 모두에 있는 결과는 더 높은 RRF 점수를 받는다", () => {
    const denseResults = [
      createResult({
        text: "공통",
        sourceUrl: "https://common.com",
      }),
    ];
    const sparseResults = [
      createResult({
        text: "공통",
        sourceUrl: "https://common.com",
      }),
    ];

    const merged = mergeWithRRF(denseResults, sparseResults, 10);

    // 양쪽 rank 1: 1/(60+1) + 1/(60+1)
    const expectedScore = 2 * (1 / (RRF_K + 1));
    expect(merged[0].score).toBeCloseTo(expectedScore, 10);
  });

  it("한쪽에만 있는 결과는 단일 RRF 점수를 받는다", () => {
    const denseResults = [
      createResult({
        text: "dense만",
        sourceUrl: "https://dense.com",
      }),
    ];
    const sparseResults = [
      createResult({
        text: "sparse만",
        sourceUrl: "https://sparse.com",
      }),
    ];

    const merged = mergeWithRRF(denseResults, sparseResults, 10);

    // 각각 rank 1: 1/(60+1)
    const expectedScore = 1 / (RRF_K + 1);
    expect(merged[0].score).toBeCloseTo(expectedScore, 10);
    expect(merged[1].score).toBeCloseTo(expectedScore, 10);
  });

  it("결과를 RRF 점수 기준 내림차순으로 정렬한다", () => {
    const denseResults = [
      createResult({ text: "A", sourceUrl: "https://a.com" }),
      createResult({ text: "B", sourceUrl: "https://b.com" }),
      createResult({ text: "C", sourceUrl: "https://c.com" }),
    ];
    const sparseResults = [
      createResult({ text: "C", sourceUrl: "https://c.com" }),
      createResult({ text: "B", sourceUrl: "https://b.com" }),
    ];

    const merged = mergeWithRRF(denseResults, sparseResults, 10);

    for (let i = 0; i < merged.length - 1; i++) {
      expect(merged[i].score).toBeGreaterThanOrEqual(
        merged[i + 1].score
      );
    }
  });

  it("limit 이하의 결과만 반환한다", () => {
    const denseResults = Array.from({ length: 10 }, (_, i) =>
      createResult({
        text: `dense-${i}`,
        sourceUrl: `https://dense-${i}.com`,
      })
    );
    const sparseResults = Array.from({ length: 10 }, (_, i) =>
      createResult({
        text: `sparse-${i}`,
        sourceUrl: `https://sparse-${i}.com`,
      })
    );

    const merged = mergeWithRRF(denseResults, sparseResults, 5);

    expect(merged.length).toBeLessThanOrEqual(5);
  });

  it("빈 검색 결과를 처리한다", () => {
    const merged = mergeWithRRF([], [], 5);

    expect(merged).toEqual([]);
  });

  it("한쪽만 빈 경우에도 올바르게 처리한다", () => {
    const denseResults = [
      createResult({ text: "A", sourceUrl: "https://a.com" }),
    ];

    const merged = mergeWithRRF(denseResults, [], 5);

    expect(merged).toHaveLength(1);
    expect(merged[0].text).toBe("A");
    expect(merged[0].score).toBeCloseTo(1 / (RRF_K + 1), 10);
  });

  it("중복 결과를 올바르게 제거한다", () => {
    const denseResults = [
      createResult({
        text: "동일",
        sourceUrl: "https://same.com",
        score: 0.9,
      }),
    ];
    const sparseResults = [
      createResult({
        text: "동일",
        sourceUrl: "https://same.com",
        score: 0.5,
      }),
    ];

    const merged = mergeWithRRF(denseResults, sparseResults, 10);

    expect(merged).toHaveLength(1);
  });

  it("RRF 점수가 올바르게 계산된다", () => {
    // dense rank 1, sparse rank 2인 결과
    const denseResults = [
      createResult({ text: "A", sourceUrl: "https://a.com" }),
      createResult({ text: "B", sourceUrl: "https://b.com" }),
    ];
    const sparseResults = [
      createResult({ text: "B", sourceUrl: "https://b.com" }),
      createResult({ text: "A", sourceUrl: "https://a.com" }),
    ];

    const merged = mergeWithRRF(denseResults, sparseResults, 10);

    // A: dense rank 1 + sparse rank 2 = 1/(60+1) + 1/(60+2)
    const scoreA = 1 / (RRF_K + 1) + 1 / (RRF_K + 2);
    // B: dense rank 2 + sparse rank 1 = 1/(60+2) + 1/(60+1)
    const scoreB = 1 / (RRF_K + 2) + 1 / (RRF_K + 1);

    // A와 B의 점수는 동일해야 한다
    expect(scoreA).toBeCloseTo(scoreB, 10);

    const resultA = merged.find((r) => r.text === "A");
    const resultB = merged.find((r) => r.text === "B");
    expect(resultA?.score).toBeCloseTo(scoreA, 10);
    expect(resultB?.score).toBeCloseTo(scoreB, 10);
  });
});

// ============================================================
// hybridSearch
// ============================================================

describe("hybridSearch", () => {
  it("쿼리를 임베딩하고 dense + sparse 검색을 수행한다", async () => {
    const mockVector = Array.from({ length: 768 }, () => 0.5);
    const mockEmbedFn = createMockEmbedFn(mockVector);
    const denseResults = [
      createResult({ text: "dense 결과", sourceUrl: "https://d.com" }),
    ];
    const sparseResults = [
      createResult({
        text: "sparse 결과",
        sourceUrl: "https://s.com",
      }),
    ];
    const mockStore = createMockVectorStore(
      denseResults,
      sparseResults
    );

    const results = await hybridSearch(
      "테스트 쿼리",
      5,
      mockStore,
      mockEmbedFn
    );

    expect(mockEmbedFn).toHaveBeenCalledWith("테스트 쿼리");
    expect(mockStore.searchDense).toHaveBeenCalledWith(
      mockVector,
      5 * PREFETCH_MULTIPLIER
    );
    expect(mockStore.searchSparse).toHaveBeenCalledWith(
      "테스트 쿼리",
      5 * PREFETCH_MULTIPLIER
    );
    expect(results.length).toBeGreaterThan(0);
  });

  it("기본 limit은 5이다", async () => {
    const mockStore = createMockVectorStore();
    const mockEmbedFn = createMockEmbedFn();

    await hybridSearch("쿼리", undefined, mockStore, mockEmbedFn);

    expect(mockStore.searchDense).toHaveBeenCalledWith(
      expect.any(Array),
      DEFAULT_LIMIT * PREFETCH_MULTIPLIER
    );
    expect(mockStore.searchSparse).toHaveBeenCalledWith(
      "쿼리",
      DEFAULT_LIMIT * PREFETCH_MULTIPLIER
    );
  });

  it("dense와 sparse 검색을 병렬로 수행한다", async () => {
    const callOrder: string[] = [];
    const mockStore = {
      searchDense: vi.fn().mockImplementation(async () => {
        callOrder.push("dense-start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        callOrder.push("dense-end");
        return [];
      }),
      searchSparse: vi.fn().mockImplementation(async () => {
        callOrder.push("sparse-start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        callOrder.push("sparse-end");
        return [];
      }),
    } as unknown as VectorStore;
    const mockEmbedFn = createMockEmbedFn();

    await hybridSearch("쿼리", 5, mockStore, mockEmbedFn);

    // 병렬 실행이므로 두 start가 먼저 나와야 한다
    expect(callOrder.indexOf("dense-start")).toBeLessThan(
      callOrder.indexOf("dense-end")
    );
    expect(callOrder.indexOf("sparse-start")).toBeLessThan(
      callOrder.indexOf("sparse-end")
    );
  });

  it("검색 결과를 RRF 점수 기준 내림차순으로 반환한다", async () => {
    const denseResults = [
      createResult({ text: "A", sourceUrl: "https://a.com" }),
      createResult({ text: "B", sourceUrl: "https://b.com" }),
    ];
    const sparseResults = [
      createResult({ text: "B", sourceUrl: "https://b.com" }),
      createResult({ text: "C", sourceUrl: "https://c.com" }),
    ];
    const mockStore = createMockVectorStore(
      denseResults,
      sparseResults
    );
    const mockEmbedFn = createMockEmbedFn();

    const results = await hybridSearch(
      "쿼리",
      10,
      mockStore,
      mockEmbedFn
    );

    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(
        results[i + 1].score
      );
    }
  });

  it("검색 결과가 없으면 빈 배열을 반환한다", async () => {
    const mockStore = createMockVectorStore([], []);
    const mockEmbedFn = createMockEmbedFn();

    const results = await hybridSearch(
      "쿼리",
      5,
      mockStore,
      mockEmbedFn
    );

    expect(results).toEqual([]);
  });

  it("각 검색 결과에 필수 메타데이터가 포함된다", async () => {
    const denseResults = [
      createResult({
        text: "결과 텍스트",
        sourceUrl: "https://example.com",
        sourceTitle: "제목",
        category: "blog",
        chunkIndex: 3,
      }),
    ];
    const mockStore = createMockVectorStore(denseResults, []);
    const mockEmbedFn = createMockEmbedFn();

    const results = await hybridSearch(
      "쿼리",
      5,
      mockStore,
      mockEmbedFn
    );

    expect(results[0]).toEqual(
      expect.objectContaining({
        text: "결과 텍스트",
        sourceUrl: "https://example.com",
        sourceTitle: "제목",
        category: "blog",
        chunkIndex: 3,
      })
    );
    expect(typeof results[0].score).toBe("number");
  });

  it("limit 파라미터로 반환 결과 수를 제한한다", async () => {
    const denseResults = Array.from({ length: 10 }, (_, i) =>
      createResult({
        text: `dense-${i}`,
        sourceUrl: `https://dense-${i}.com`,
      })
    );
    const sparseResults = Array.from({ length: 10 }, (_, i) =>
      createResult({
        text: `sparse-${i}`,
        sourceUrl: `https://sparse-${i}.com`,
      })
    );
    const mockStore = createMockVectorStore(
      denseResults,
      sparseResults
    );
    const mockEmbedFn = createMockEmbedFn();

    const results = await hybridSearch(
      "쿼리",
      3,
      mockStore,
      mockEmbedFn
    );

    expect(results.length).toBeLessThanOrEqual(3);
  });
});

// ============================================================
// 상수 검증
// ============================================================

describe("상수", () => {
  it("RRF_K는 60이다", () => {
    expect(RRF_K).toBe(60);
  });

  it("DEFAULT_LIMIT은 5이다", () => {
    expect(DEFAULT_LIMIT).toBe(5);
  });

  it("PREFETCH_MULTIPLIER는 4이다", () => {
    expect(PREFETCH_MULTIPLIER).toBe(4);
  });
});
