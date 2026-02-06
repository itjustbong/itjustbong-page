import crypto from "crypto";
import type { ConversationMessage, ConversationSession } from "../types";

/** 대화 히스토리 요약 임계값 (턴 수) */
const DEFAULT_SUMMARY_THRESHOLD = 10;

/** 대화 요약 함수 타입 (테스트 가능성을 위해 주입 가능) */
type SummarizerFn = (messages: ConversationMessage[]) => Promise<string>;

/**
 * 대화 맥락을 관리하는 컴포넌트.
 *
 * - UUID 기반 세션 관리
 * - 인메모리 대화 히스토리 저장
 * - 히스토리 길이 초과 시 LLM 요약 기능
 */
class ConversationManager {
  private sessions: Map<string, ConversationSession> = new Map();
  private summaryThreshold: number;
  private summarizer: SummarizerFn | undefined;

  constructor(options?: {
    summaryThreshold?: number;
    summarizer?: SummarizerFn;
  }) {
    this.summaryThreshold =
      options?.summaryThreshold ?? DEFAULT_SUMMARY_THRESHOLD;
    this.summarizer = options?.summarizer;
  }

  /**
   * 새로운 대화 세션을 생성한다.
   * @returns 생성된 세션의 UUID
   */
  createSession(): string {
    const id = crypto.randomUUID();
    const session: ConversationSession = {
      id,
      messages: [],
    };
    this.sessions.set(id, session);
    return id;
  }

  /**
   * 세션에 메시지를 추가한다.
   * @throws 존재하지 않는 세션 ID인 경우 오류 발생
   */
  addMessage(sessionId: string, message: ConversationMessage): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(
        `세션을 찾을 수 없습니다: ${sessionId}`
      );
    }
    session.messages.push(message);
  }

  /**
   * 세션의 대화 히스토리를 반환한다.
   * @throws 존재하지 않는 세션 ID인 경우 오류 발생
   */
  getHistory(sessionId: string): ConversationMessage[] {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(
        `세션을 찾을 수 없습니다: ${sessionId}`
      );
    }
    return [...session.messages];
  }

  /**
   * 대화 히스토리가 임계값을 초과하면 요약하고,
   * 요약된 내용을 시스템 메시지로 포함한 히스토리를 반환한다.
   *
   * - 임계값 이하: 전체 히스토리를 그대로 반환
   * - 임계값 초과: 이전 메시지를 요약하고, 요약 + 최근 메시지를 반환
   *
   * @throws 존재하지 않는 세션 ID인 경우 오류 발생
   * @throws summarizer가 설정되지 않은 상태에서 요약이 필요한 경우 오류 발생
   */
  async summarizeIfNeeded(
    sessionId: string
  ): Promise<ConversationMessage[]> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(
        `세션을 찾을 수 없습니다: ${sessionId}`
      );
    }

    const { messages } = session;

    // 임계값 이하이면 전체 히스토리 반환
    if (messages.length <= this.summaryThreshold) {
      // 기존 요약이 있으면 시스템 메시지로 포함
      if (session.summary) {
        return [
          {
            role: "assistant" as const,
            content: `[이전 대화 요약] ${session.summary}`,
            timestamp: new Date().toISOString(),
          },
          ...messages,
        ];
      }
      return [...messages];
    }

    // summarizer가 없으면 오류
    if (!this.summarizer) {
      throw new Error(
        "대화 요약을 위한 summarizer가 설정되지 않았습니다"
      );
    }

    // 요약할 메시지와 유지할 최근 메시지 분리
    const keepCount = Math.floor(this.summaryThreshold / 2);
    const messagesToSummarize = messages.slice(0, -keepCount);
    const recentMessages = messages.slice(-keepCount);

    // LLM으로 요약 생성
    const summary = await this.summarizer(messagesToSummarize);

    // 세션에 요약 저장 및 메시지 정리
    session.summary = summary;
    session.messages = recentMessages;

    // 요약 시스템 메시지 + 최근 메시지 반환
    return [
      {
        role: "assistant" as const,
        content: `[이전 대화 요약] ${summary}`,
        timestamp: new Date().toISOString(),
      },
      ...recentMessages,
    ];
  }

  /**
   * 세션이 존재하는지 확인한다.
   */
  hasSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }
}

export { ConversationManager, DEFAULT_SUMMARY_THRESHOLD };
export type { SummarizerFn };
