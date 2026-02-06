import { describe, it, expect } from "vitest";
import {
  RateLimiter,
  getKstDateString,
  getNextKstMidnight,
  DEFAULT_DAILY_LIMIT,
} from "./rate-limiter";

// ============================================================
// 헬퍼 함수
// ============================================================

/**
 * 고정된 시각을 반환하는 nowFn을 생성한다.
 */
function fixedNow(isoString: string): () => Date {
  return () => new Date(isoString);
}

// ============================================================
// DEFAULT_DAILY_LIMIT
// ============================================================

describe("DEFAULT_DAILY_LIMIT", () => {
  it("기본 일일 요청 제한은 20이다", () => {
    expect(DEFAULT_DAILY_LIMIT).toBe(20);
  });
});

// ============================================================
// getKstDateString
// ============================================================

describe("getKstDateString", () => {
  it("UTC 시각을 KST 날짜 문자열로 변환한다", () => {
    // 2024-01-15 15:00 UTC = 2024-01-16 00:00 KST
    const date = new Date("2024-01-15T15:00:00Z");
    expect(getKstDateString(date)).toBe("2024-01-16");
  });

  it("UTC 자정은 KST 09:00이므로 같은 날짜이다", () => {
    // 2024-01-15 00:00 UTC = 2024-01-15 09:00 KST
    const date = new Date("2024-01-15T00:00:00Z");
    expect(getKstDateString(date)).toBe("2024-01-15");
  });

  it("UTC 14:59는 아직 KST 23:59이므로 같은 날짜이다", () => {
    // 2024-01-15 14:59 UTC = 2024-01-15 23:59 KST
    const date = new Date("2024-01-15T14:59:00Z");
    expect(getKstDateString(date)).toBe("2024-01-15");
  });

  it("UTC 15:00은 KST 다음 날 00:00이다", () => {
    // 2024-01-15 15:00 UTC = 2024-01-16 00:00 KST
    const date = new Date("2024-01-15T15:00:00Z");
    expect(getKstDateString(date)).toBe("2024-01-16");
  });
});

// ============================================================
// getNextKstMidnight
// ============================================================

describe("getNextKstMidnight", () => {
  it("다음 KST 자정의 ISO 8601 문자열을 반환한다", () => {
    // 2024-01-15 10:00 KST → 다음 KST 자정 = 2024-01-16 00:00 KST = 2024-01-15T15:00:00Z
    const date = new Date("2024-01-15T01:00:00Z"); // KST 10:00
    const result = getNextKstMidnight(date);
    expect(result).toBe("2024-01-15T15:00:00.000Z");
  });

  it("KST 자정 직후에도 다음 날 자정을 반환한다", () => {
    // 2024-01-15 15:01 UTC = 2024-01-16 00:01 KST
    // 다음 KST 자정 = 2024-01-17 00:00 KST = 2024-01-16T15:00:00Z
    const date = new Date("2024-01-15T15:01:00Z");
    const result = getNextKstMidnight(date);
    expect(result).toBe("2024-01-16T15:00:00.000Z");
  });
});

// ============================================================
// RateLimiter - 생성
// ============================================================

describe("RateLimiter 생성", () => {
  it("기본 옵션으로 생성할 수 있다", () => {
    const limiter = new RateLimiter();
    expect(limiter).toBeInstanceOf(RateLimiter);
  });

  it("커스텀 dailyLimit으로 생성할 수 있다", () => {
    const limiter = new RateLimiter({ dailyLimit: 5 });
    const result = limiter.checkLimit("client-1");
    expect(result.remaining).toBe(5);
  });
});

// ============================================================
// RateLimiter - checkLimit
// ============================================================

describe("checkLimit", () => {
  it("새로운 클라이언트는 전체 횟수가 허용된다", () => {
    const limiter = new RateLimiter({
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    const result = limiter.checkLimit("client-1");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(20);
    expect(result.resetAt).toBeTruthy();
  });

  it("요청 후 남은 횟수가 감소한다", () => {
    const limiter = new RateLimiter({
      dailyLimit: 5,
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    limiter.increment("client-1");
    const result = limiter.checkLimit("client-1");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("한도에 도달하면 요청이 거부된다", () => {
    const limiter = new RateLimiter({
      dailyLimit: 3,
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    limiter.increment("client-1");
    limiter.increment("client-1");
    limiter.increment("client-1");

    const result = limiter.checkLimit("client-1");

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("한도 초과 후에도 remaining은 0 이하로 내려가지 않는다", () => {
    const limiter = new RateLimiter({
      dailyLimit: 2,
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    limiter.increment("client-1");
    limiter.increment("client-1");
    limiter.increment("client-1"); // 한도 초과

    const result = limiter.checkLimit("client-1");

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resetAt은 다음 KST 자정을 반환한다", () => {
    const limiter = new RateLimiter({
      nowFn: fixedNow("2024-01-15T01:00:00Z"), // KST 10:00
    });

    const result = limiter.checkLimit("client-1");

    // 다음 KST 자정 = 2024-01-16 00:00 KST = 2024-01-15T15:00:00Z
    expect(result.resetAt).toBe("2024-01-15T15:00:00.000Z");
  });

  it("서로 다른 클라이언트는 독립적으로 카운트된다", () => {
    const limiter = new RateLimiter({
      dailyLimit: 2,
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    limiter.increment("client-1");
    limiter.increment("client-1");

    const result1 = limiter.checkLimit("client-1");
    const result2 = limiter.checkLimit("client-2");

    expect(result1.allowed).toBe(false);
    expect(result1.remaining).toBe(0);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(2);
  });
});

// ============================================================
// RateLimiter - increment
// ============================================================

describe("increment", () => {
  it("카운터를 1 증가시킨다", () => {
    const limiter = new RateLimiter({
      dailyLimit: 10,
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    limiter.increment("client-1");

    const result = limiter.checkLimit("client-1");
    expect(result.remaining).toBe(9);
  });

  it("여러 번 호출하면 카운터가 누적된다", () => {
    const limiter = new RateLimiter({
      dailyLimit: 10,
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    limiter.increment("client-1");
    limiter.increment("client-1");
    limiter.increment("client-1");

    const result = limiter.checkLimit("client-1");
    expect(result.remaining).toBe(7);
  });

  it("한도 초과 후에도 increment는 계속 동작한다", () => {
    const limiter = new RateLimiter({
      dailyLimit: 2,
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    limiter.increment("client-1");
    limiter.increment("client-1");
    limiter.increment("client-1"); // 한도 초과

    // 에러 없이 동작해야 한다
    const result = limiter.checkLimit("client-1");
    expect(result.allowed).toBe(false);
  });
});

// ============================================================
// RateLimiter - KST 자정 초기화
// ============================================================

describe("KST 자정 초기화", () => {
  it("날짜가 변경되면 카운터가 초기화된다", () => {
    let currentTime = new Date("2024-01-15T01:00:00Z"); // KST 10:00
    const limiter = new RateLimiter({
      dailyLimit: 3,
      nowFn: () => currentTime,
    });

    // 1월 15일에 3회 요청
    limiter.increment("client-1");
    limiter.increment("client-1");
    limiter.increment("client-1");

    expect(limiter.checkLimit("client-1").allowed).toBe(false);

    // KST 자정 이후로 시간 변경 (1월 16일 KST)
    currentTime = new Date("2024-01-15T15:00:00Z"); // KST 2024-01-16 00:00

    const result = limiter.checkLimit("client-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(3);
  });

  it("날짜 변경 후 increment는 새 카운터를 시작한다", () => {
    let currentTime = new Date("2024-01-15T01:00:00Z");
    const limiter = new RateLimiter({
      dailyLimit: 3,
      nowFn: () => currentTime,
    });

    // 1월 15일에 2회 요청
    limiter.increment("client-1");
    limiter.increment("client-1");

    // KST 자정 이후로 시간 변경
    currentTime = new Date("2024-01-15T15:00:00Z");

    // 새 날짜에서 increment
    limiter.increment("client-1");

    const result = limiter.checkLimit("client-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2); // 3 - 1 = 2
  });

  it("KST 자정 직전과 직후의 날짜가 다르다", () => {
    const limiter = new RateLimiter({ dailyLimit: 1 });

    // KST 23:59 (UTC 14:59)
    const beforeMidnight = new Date("2024-01-15T14:59:00Z");
    // KST 00:00 (UTC 15:00)
    const afterMidnight = new Date("2024-01-15T15:00:00Z");

    expect(getKstDateString(beforeMidnight)).toBe("2024-01-15");
    expect(getKstDateString(afterMidnight)).toBe("2024-01-16");
  });
});

// ============================================================
// RateLimiter - 20회 제한 시나리오
// ============================================================

describe("20회 제한 시나리오", () => {
  it("처음 20회 요청은 허용되고 21번째는 거부된다", () => {
    const limiter = new RateLimiter({
      dailyLimit: 20,
      nowFn: fixedNow("2024-01-15T01:00:00Z"),
    });

    // 20회 요청
    for (let i = 0; i < 20; i++) {
      const check = limiter.checkLimit("client-1");
      expect(check.allowed).toBe(true);
      expect(check.remaining).toBe(20 - i);
      limiter.increment("client-1");
    }

    // 21번째 요청은 거부
    const result = limiter.checkLimit("client-1");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("20회 사용 후 자정이 지나면 다시 20회 사용 가능하다", () => {
    let currentTime = new Date("2024-01-15T01:00:00Z");
    const limiter = new RateLimiter({
      dailyLimit: 20,
      nowFn: () => currentTime,
    });

    // 20회 요청
    for (let i = 0; i < 20; i++) {
      limiter.increment("client-1");
    }

    expect(limiter.checkLimit("client-1").allowed).toBe(false);

    // 다음 날로 이동
    currentTime = new Date("2024-01-15T15:00:00Z");

    const result = limiter.checkLimit("client-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(20);
  });
});
