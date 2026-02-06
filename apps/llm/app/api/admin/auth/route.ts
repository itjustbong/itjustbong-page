import { type NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { validateEnv } from "../../../../lib/config/env";

// ============================================================
// 타입 정의
// ============================================================

/** 인증 요청 본문 */
interface AuthRequestBody {
  username: string;
  password: string;
}

// ============================================================
// 상수
// ============================================================

/** 세션 쿠키 이름 */
export const SESSION_COOKIE_NAME = "admin_session";

/** 세션 쿠키 만료 시간 (24시간, 초 단위) */
export const SESSION_MAX_AGE = 60 * 60 * 24;

// ============================================================
// 세션 저장소 (인메모리)
// ============================================================

/** 활성 세션 토큰 저장소 (토큰 → 만료 시각) */
const activeSessions = new Map<string, number>();

/**
 * 세션 토큰이 유효한지 확인한다.
 * 만료된 세션은 자동으로 제거한다.
 */
export function isValidSession(token: string): boolean {
  const expiresAt = activeSessions.get(token);
  if (expiresAt === undefined) {
    return false;
  }

  if (Date.now() > expiresAt) {
    activeSessions.delete(token);
    return false;
  }

  return true;
}

/**
 * 새 세션 토큰을 생성하고 저장한다.
 */
function createSessionToken(): string {
  const token = randomUUID();
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  activeSessions.set(token, expiresAt);
  return token;
}

// ============================================================
// 헬퍼 함수
// ============================================================

/**
 * 요청 본문에서 아이디와 비밀번호를 추출하고 검증한다.
 * 유효하지 않은 경우 null을 반환한다.
 */
function parseAuthRequest(
  body: unknown
): AuthRequestBody | null {
  if (
    typeof body !== "object" ||
    body === null ||
    !("username" in body) ||
    !("password" in body)
  ) {
    return null;
  }

  const { username, password } = body as Record<
    string,
    unknown
  >;

  if (
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return null;
  }

  if (username.trim().length === 0 || password.length === 0) {
    return null;
  }

  return { username: username.trim(), password };
}

/**
 * 아이디와 비밀번호가 환경 변수에 설정된 값과 일치하는지 확인한다.
 */
export function verifyCredentials(
  username: string,
  password: string
): boolean {
  const env = validateEnv();
  return (
    username === env.ADMIN_USERNAME &&
    password === env.ADMIN_PASSWORD
  );
}

// ============================================================
// API 라우트 핸들러
// ============================================================

/**
 * POST /api/admin/auth
 *
 * 관리자 아이디/비밀번호를 검증하고 세션 토큰을 발급한다.
 *
 * 요청 본문:
 * - username: string — 관리자 아이디
 * - password: string — 관리자 비밀번호
 *
 * 응답:
 * - 200: 인증 성공, 세션 쿠키 설정
 * - 400: 잘못된 요청 형식
 * - 401: 인증 실패
 * - 500: 서버 오류
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // 1. 요청 본문 파싱
    const body: unknown = await request.json();
    const credentials = parseAuthRequest(body);

    if (credentials === null) {
      return NextResponse.json(
        { error: "아이디와 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 2. 아이디/비밀번호 검증
    const isValid = verifyCredentials(
      credentials.username,
      credentials.password
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "인증에 실패했습니다." },
        { status: 401 }
      );
    }

    // 3. 세션 토큰 발급 및 쿠키 설정
    const sessionToken = createSessionToken();

    const response = NextResponse.json(
      { success: true, message: "인증에 성공했습니다." },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("관리자 인증 API 오류:", error);

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
