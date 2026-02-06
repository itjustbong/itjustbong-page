import type { RateLimitResult } from "../types";

/** 클라이언트별 요청 카운터 */
interface ClientCounter {
  /** 현재 요청 횟수 */
  count: number;
  /** KST 기준 날짜 문자열 (YYYY-MM-DD) */
  date: string;
}

/** Rate Limiter 옵션 */
interface RateLimiterOptions {
  /** 일일 최대 요청 횟수 (기본값: 20) */
  dailyLimit?: number;
  /** 현재 시각을 반환하는 함수 (테스트용 주입) */
  nowFn?: () => Date;
}

/** KST 오프셋 (밀리초): UTC+9 */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 기본 일일 요청 제한 */
const DEFAULT_DAILY_LIMIT = 20;

/**
 * 주어진 Date 객체에서 KST 기준 날짜 문자열을 반환한다.
 * @param date - Date 객체
 * @returns KST 기준 YYYY-MM-DD 형식 문자열
 */
function getKstDateString(date: Date): string {
  const kstTime = new Date(date.getTime() + KST_OFFSET_MS);
  return kstTime.toISOString().slice(0, 10);
}

/**
 * 다음 KST 자정의 ISO 8601 문자열을 반환한다.
 * @param date - 현재 시각
 * @returns 다음 KST 자정의 ISO 8601 문자열
 */
function getNextKstMidnight(date: Date): string {
  const kstDateStr = getKstDateString(date);
  // KST 자정 = UTC 기준 전날 15:00
  // 다음 KST 자정 = 현재 KST 날짜 + 1일의 00:00:00 KST
  const nextDay = new Date(`${kstDateStr}T00:00:00+09:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString();
}

/**
 * 사용자의 일일 요청 횟수를 제한하는 Rate Limiter.
 *
 * - IP/세션 기반 사용자 식별 (clientId)
 * - 인메모리 카운터 (Map 기반)
 * - 일일 제한, KST 자정 초기화
 */
class RateLimiter {
  private readonly counters: Map<string, ClientCounter> = new Map();
  private readonly dailyLimit: number;
  private readonly nowFn: () => Date;

  constructor(options?: RateLimiterOptions) {
    this.dailyLimit = options?.dailyLimit ?? DEFAULT_DAILY_LIMIT;
    this.nowFn = options?.nowFn ?? (() => new Date());
  }

  /**
   * 클라이언트의 요청 가능 여부를 확인한다.
   * 날짜가 변경된 경우 카운터를 자동 초기화한다.
   *
   * @param clientId - 클라이언트 식별자 (IP 또는 세션 ID)
   * @returns 요청 허용 여부, 남은 횟수, 초기화 시각
   */
  checkLimit(clientId: string): RateLimitResult {
    const now = this.nowFn();
    const todayKst = getKstDateString(now);
    const resetAt = getNextKstMidnight(now);

    const counter = this.counters.get(clientId);

    // 카운터가 없거나 날짜가 변경된 경우 → 전체 횟수 사용 가능
    if (!counter || counter.date !== todayKst) {
      return {
        allowed: true,
        remaining: this.dailyLimit,
        resetAt,
      };
    }

    const remaining = Math.max(0, this.dailyLimit - counter.count);
    const allowed = counter.count < this.dailyLimit;

    return {
      allowed,
      remaining,
      resetAt,
    };
  }

  /**
   * 클라이언트의 요청 카운터를 증가시킨다.
   * 날짜가 변경된 경우 카운터를 초기화한 후 증가시킨다.
   *
   * @param clientId - 클라이언트 식별자 (IP 또는 세션 ID)
   */
  increment(clientId: string): void {
    const now = this.nowFn();
    const todayKst = getKstDateString(now);

    const counter = this.counters.get(clientId);

    // 카운터가 없거나 날짜가 변경된 경우 → 새로 시작
    if (!counter || counter.date !== todayKst) {
      this.counters.set(clientId, { count: 1, date: todayKst });
      return;
    }

    counter.count += 1;
  }
}

export {
  RateLimiter,
  getKstDateString,
  getNextKstMidnight,
  DEFAULT_DAILY_LIMIT,
  KST_OFFSET_MS,
};
export type { RateLimiterOptions, ClientCounter };
