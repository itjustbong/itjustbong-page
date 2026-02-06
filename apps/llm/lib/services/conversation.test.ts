import { describe, it, expect, vi } from "vitest";
import {
  ConversationManager,
  DEFAULT_SUMMARY_THRESHOLD,
} from "./conversation";
import type { SummarizerFn } from "./conversation";
import type { ConversationMessage } from "../types";

// ============================================================
// 헬퍼 함수
// ============================================================

function createMessage(
  role: "user" | "assistant",
  content: string
): ConversationMessage {
  return {
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

function createMessages(count: number): ConversationMessage[] {
  const messages: ConversationMessage[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? "user" : "assistant";
    messages.push(
      createMessage(role as "user" | "assistant", `메시지 ${i + 1}`)
    );
  }
  return messages;
}

// ============================================================
// DEFAULT_SUMMARY_THRESHOLD
// ============================================================

describe("DEFAULT_SUMMARY_THRESHOLD", () => {
  it("기본 요약 임계값은 10이다", () => {
    expect(DEFAULT_SUMMARY_THRESHOLD).toBe(10);
  });
});

// ============================================================
// createSession
// ============================================================

describe("createSession", () => {
  it("UUID 형식의 세션 ID를 반환한다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();
    // UUID v4 형식 검증
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(sessionId).toMatch(uuidRegex);
  });

  it("새 세션의 히스토리는 빈 배열이다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();
    expect(manager.getHistory(sessionId)).toEqual([]);
  });

  it("여러 세션을 생성하면 모두 고유한 ID를 가진다", () => {
    const manager = new ConversationManager();
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(manager.createSession());
    }
    expect(ids.size).toBe(100);
  });
});

// ============================================================
// addMessage
// ============================================================

describe("addMessage", () => {
  it("세션에 메시지를 추가한다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();
    const message = createMessage("user", "안녕하세요");

    manager.addMessage(sessionId, message);

    const history = manager.getHistory(sessionId);
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual(message);
  });

  it("여러 메시지를 순서대로 추가한다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();
    const msg1 = createMessage("user", "질문입니다");
    const msg2 = createMessage("assistant", "답변입니다");
    const msg3 = createMessage("user", "후속 질문입니다");

    manager.addMessage(sessionId, msg1);
    manager.addMessage(sessionId, msg2);
    manager.addMessage(sessionId, msg3);

    const history = manager.getHistory(sessionId);
    expect(history).toHaveLength(3);
    expect(history[0]).toEqual(msg1);
    expect(history[1]).toEqual(msg2);
    expect(history[2]).toEqual(msg3);
  });

  it("존재하지 않는 세션에 메시지를 추가하면 오류가 발생한다", () => {
    const manager = new ConversationManager();
    const message = createMessage("user", "안녕하세요");

    expect(() =>
      manager.addMessage("존재하지-않는-세션", message)
    ).toThrow("세션을 찾을 수 없습니다");
  });

  it("서로 다른 세션에 독립적으로 메시지를 추가한다", () => {
    const manager = new ConversationManager();
    const session1 = manager.createSession();
    const session2 = manager.createSession();

    manager.addMessage(session1, createMessage("user", "세션1 메시지"));
    manager.addMessage(session2, createMessage("user", "세션2 메시지"));

    expect(manager.getHistory(session1)).toHaveLength(1);
    expect(manager.getHistory(session1)[0].content).toBe("세션1 메시지");
    expect(manager.getHistory(session2)).toHaveLength(1);
    expect(manager.getHistory(session2)[0].content).toBe("세션2 메시지");
  });
});

// ============================================================
// getHistory
// ============================================================

describe("getHistory", () => {
  it("빈 세션의 히스토리는 빈 배열이다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();
    expect(manager.getHistory(sessionId)).toEqual([]);
  });

  it("추가된 메시지를 동일한 순서로 반환한다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();
    const messages = createMessages(5);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    const history = manager.getHistory(sessionId);
    expect(history).toEqual(messages);
  });

  it("반환된 배열을 수정해도 원본에 영향을 주지 않는다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();
    manager.addMessage(sessionId, createMessage("user", "원본 메시지"));

    const history = manager.getHistory(sessionId);
    history.push(createMessage("assistant", "추가된 메시지"));

    // 원본은 변경되지 않아야 한다
    expect(manager.getHistory(sessionId)).toHaveLength(1);
  });

  it("존재하지 않는 세션의 히스토리를 조회하면 오류가 발생한다", () => {
    const manager = new ConversationManager();
    expect(() => manager.getHistory("없는-세션")).toThrow(
      "세션을 찾을 수 없습니다"
    );
  });
});

// ============================================================
// summarizeIfNeeded
// ============================================================

describe("summarizeIfNeeded", () => {
  it("임계값 이하이면 전체 히스토리를 그대로 반환한다", async () => {
    const manager = new ConversationManager({ summaryThreshold: 10 });
    const sessionId = manager.createSession();
    const messages = createMessages(5);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    const result = await manager.summarizeIfNeeded(sessionId);
    expect(result).toEqual(messages);
  });

  it("임계값과 동일한 수의 메시지는 요약하지 않는다", async () => {
    const threshold = 6;
    const manager = new ConversationManager({
      summaryThreshold: threshold,
    });
    const sessionId = manager.createSession();
    const messages = createMessages(threshold);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    const result = await manager.summarizeIfNeeded(sessionId);
    expect(result).toEqual(messages);
  });

  it("임계값 초과 시 summarizer를 호출하여 요약한다", async () => {
    const threshold = 4;
    const mockSummarizer: SummarizerFn = vi.fn().mockResolvedValue(
      "이전 대화 요약 내용"
    );
    const manager = new ConversationManager({
      summaryThreshold: threshold,
      summarizer: mockSummarizer,
    });
    const sessionId = manager.createSession();
    const messages = createMessages(6);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    const result = await manager.summarizeIfNeeded(sessionId);

    // summarizer가 호출되었는지 확인
    expect(mockSummarizer).toHaveBeenCalledTimes(1);

    // 첫 번째 메시지는 요약 시스템 메시지
    expect(result[0].content).toContain("[이전 대화 요약]");
    expect(result[0].content).toContain("이전 대화 요약 내용");
  });

  it("요약 후 최근 메시지를 유지한다", async () => {
    const threshold = 4;
    const keepCount = Math.floor(threshold / 2); // 2
    const mockSummarizer: SummarizerFn = vi
      .fn()
      .mockResolvedValue("요약");
    const manager = new ConversationManager({
      summaryThreshold: threshold,
      summarizer: mockSummarizer,
    });
    const sessionId = manager.createSession();
    const messages = createMessages(6);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    const result = await manager.summarizeIfNeeded(sessionId);

    // 요약 메시지(1) + 최근 메시지(keepCount)
    expect(result).toHaveLength(1 + keepCount);

    // 최근 메시지가 유지되는지 확인
    const recentMessages = result.slice(1);
    expect(recentMessages).toEqual(messages.slice(-keepCount));
  });

  it("요약 후 세션의 메시지가 정리된다", async () => {
    const threshold = 4;
    const keepCount = Math.floor(threshold / 2);
    const mockSummarizer: SummarizerFn = vi
      .fn()
      .mockResolvedValue("요약 내용");
    const manager = new ConversationManager({
      summaryThreshold: threshold,
      summarizer: mockSummarizer,
    });
    const sessionId = manager.createSession();
    const messages = createMessages(6);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    await manager.summarizeIfNeeded(sessionId);

    // 세션의 메시지가 최근 메시지만 남아야 한다
    const history = manager.getHistory(sessionId);
    expect(history).toHaveLength(keepCount);
  });

  it("요약 내용이 세션에 저장된다", async () => {
    const threshold = 4;
    const summaryText = "이것은 요약입니다";
    const mockSummarizer: SummarizerFn = vi
      .fn()
      .mockResolvedValue(summaryText);
    const manager = new ConversationManager({
      summaryThreshold: threshold,
      summarizer: mockSummarizer,
    });
    const sessionId = manager.createSession();
    const messages = createMessages(6);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    await manager.summarizeIfNeeded(sessionId);

    // 두 번째 호출 시 (임계값 이하) 기존 요약이 포함되어야 한다
    const result = await manager.summarizeIfNeeded(sessionId);
    expect(result[0].content).toContain(summaryText);
  });

  it("summarizer 없이 임계값 초과 시 오류가 발생한다", async () => {
    const manager = new ConversationManager({ summaryThreshold: 4 });
    const sessionId = manager.createSession();
    const messages = createMessages(6);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    await expect(
      manager.summarizeIfNeeded(sessionId)
    ).rejects.toThrow("summarizer가 설정되지 않았습니다");
  });

  it("존재하지 않는 세션에 대해 오류가 발생한다", async () => {
    const manager = new ConversationManager();
    await expect(
      manager.summarizeIfNeeded("없는-세션")
    ).rejects.toThrow("세션을 찾을 수 없습니다");
  });

  it("summarizer에 요약할 메시지만 전달한다", async () => {
    const threshold = 4;
    const keepCount = Math.floor(threshold / 2); // 2
    const mockSummarizer: SummarizerFn = vi
      .fn()
      .mockResolvedValue("요약");
    const manager = new ConversationManager({
      summaryThreshold: threshold,
      summarizer: mockSummarizer,
    });
    const sessionId = manager.createSession();
    const messages = createMessages(6);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    await manager.summarizeIfNeeded(sessionId);

    // summarizer에 전달된 메시지는 최근 keepCount개를 제외한 나머지
    const expectedSummarizeMessages = messages.slice(0, -keepCount);
    expect(mockSummarizer).toHaveBeenCalledWith(
      expectedSummarizeMessages
    );
  });
});

// ============================================================
// hasSession
// ============================================================

describe("hasSession", () => {
  it("존재하는 세션은 true를 반환한다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();
    expect(manager.hasSession(sessionId)).toBe(true);
  });

  it("존재하지 않는 세션은 false를 반환한다", () => {
    const manager = new ConversationManager();
    expect(manager.hasSession("없는-세션")).toBe(false);
  });
});

// ============================================================
// 커스텀 옵션
// ============================================================

describe("커스텀 옵션", () => {
  it("커스텀 summaryThreshold를 적용한다", async () => {
    const mockSummarizer: SummarizerFn = vi
      .fn()
      .mockResolvedValue("요약");
    const manager = new ConversationManager({
      summaryThreshold: 3,
      summarizer: mockSummarizer,
    });
    const sessionId = manager.createSession();
    const messages = createMessages(4);

    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    await manager.summarizeIfNeeded(sessionId);
    expect(mockSummarizer).toHaveBeenCalledTimes(1);
  });

  it("옵션 없이 생성하면 기본값을 사용한다", () => {
    const manager = new ConversationManager();
    const sessionId = manager.createSession();

    // 기본 임계값(10) 이하이므로 요약 없이 반환
    const messages = createMessages(10);
    for (const msg of messages) {
      manager.addMessage(sessionId, msg);
    }

    // 10개 메시지는 임계값과 동일하므로 요약하지 않음
    return manager.summarizeIfNeeded(sessionId).then((result) => {
      expect(result).toEqual(messages);
    });
  });
});
