import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  POST,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  verifyCredentials,
  isValidSession,
} from "./route";

// ============================================================
// 환경 변수 모킹
// ============================================================

/**
 * validateEnv를 모킹하여 테스트 환경에서 환경 변수를 제어한다.
 */
vi.mock("../../../../lib/config/env", () => ({
  validateEnv: () => ({
    GEMINI_API_KEY: "test-api-key",
    QDRANT_URL: "http://localhost:6333",
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD: "secret123",
    GEMINI_LLM_MODEL: "gemini-2.5-flash",
    GEMINI_EMBEDDING_MODEL: "gemini-embedding-001",
    QDRANT_COLLECTION: "knowledge_chunks",
    DAILY_REQUEST_LIMIT: 20,
  }),
}));

// ============================================================
// 헬퍼 함수
// ============================================================

/**
 * 인증 요청을 생성하는 헬퍼 함수.
 */
function createAuthRequest(
  body: Record<string, unknown>
): NextRequest {
  return new NextRequest("http://localhost:3000/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ============================================================
// verifyCredentials
// ============================================================

describe("verifyCredentials", () => {
  it("올바른 아이디와 비밀번호로 인증에 성공한다", () => {
    expect(verifyCredentials("admin", "secret123")).toBe(true);
  });

  it("잘못된 아이디로 인증에 실패한다", () => {
    expect(verifyCredentials("wrong", "secret123")).toBe(false);
  });

  it("잘못된 비밀번호로 인증에 실패한다", () => {
    expect(verifyCredentials("admin", "wrong")).toBe(false);
  });

  it("아이디와 비밀번호 모두 잘못된 경우 인증에 실패한다", () => {
    expect(verifyCredentials("wrong", "wrong")).toBe(false);
  });

  it("빈 문자열로 인증에 실패한다", () => {
    expect(verifyCredentials("", "")).toBe(false);
  });
});

// ============================================================
// POST /api/admin/auth - 인증 성공
// ============================================================

describe("POST /api/admin/auth - 인증 성공", () => {
  it("올바른 자격 증명으로 200 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: "admin",
      password: "secret123",
    });

    const response = await POST(request);

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe("인증에 성공했습니다.");
  });

  it("인증 성공 시 세션 쿠키를 설정한다", async () => {
    const request = createAuthRequest({
      username: "admin",
      password: "secret123",
    });

    const response = await POST(request);

    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain(SESSION_COOKIE_NAME);
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain(`Max-Age=${SESSION_MAX_AGE}`);
  });
});

// ============================================================
// POST /api/admin/auth - 인증 실패
// ============================================================

describe("POST /api/admin/auth - 인증 실패", () => {
  it("잘못된 아이디로 401 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: "wrong",
      password: "secret123",
    });

    const response = await POST(request);

    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBe("인증에 실패했습니다.");
  });

  it("잘못된 비밀번호로 401 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: "admin",
      password: "wrong",
    });

    const response = await POST(request);

    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBe("인증에 실패했습니다.");
  });

  it("인증 실패 시 세션 쿠키를 설정하지 않는다", async () => {
    const request = createAuthRequest({
      username: "wrong",
      password: "wrong",
    });

    const response = await POST(request);

    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toBeNull();
  });
});

// ============================================================
// POST /api/admin/auth - 잘못된 요청
// ============================================================

describe("POST /api/admin/auth - 잘못된 요청", () => {
  it("username 필드가 없으면 400 응답을 반환한다", async () => {
    const request = createAuthRequest({
      password: "secret123",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("아이디와 비밀번호를 입력해주세요.");
  });

  it("password 필드가 없으면 400 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: "admin",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("아이디와 비밀번호를 입력해주세요.");
  });

  it("빈 username으로 400 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: "",
      password: "secret123",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("공백만 있는 username으로 400 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: "   ",
      password: "secret123",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("빈 password로 400 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: "admin",
      password: "",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("username이 문자열이 아니면 400 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: 123,
      password: "secret123",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("password가 문자열이 아니면 400 응답을 반환한다", async () => {
    const request = createAuthRequest({
      username: "admin",
      password: 123,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});

// ============================================================
// isValidSession
// ============================================================

describe("isValidSession", () => {
  it("존재하지 않는 토큰은 유효하지 않다", () => {
    expect(isValidSession("nonexistent-token")).toBe(false);
  });

  it("인증 성공 후 발급된 세션 토큰은 유효하다", async () => {
    const request = createAuthRequest({
      username: "admin",
      password: "secret123",
    });

    const response = await POST(request);
    const setCookie = response.headers.get("set-cookie") ?? "";

    // 쿠키에서 세션 토큰 추출
    const match = setCookie.match(
      new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`)
    );
    expect(match).toBeTruthy();

    const token = match![1];
    expect(isValidSession(token)).toBe(true);
  });
});

// ============================================================
// 세션 쿠키 속성
// ============================================================

describe("세션 쿠키 속성", () => {
  it("SameSite=Lax 속성이 설정된다", async () => {
    const request = createAuthRequest({
      username: "admin",
      password: "secret123",
    });

    const response = await POST(request);
    const setCookie = response.headers.get("set-cookie");

    expect(setCookie?.toLowerCase()).toContain("samesite=lax");
  });
});
