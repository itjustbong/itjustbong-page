import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { envSchema, validateEnv } from "./env";

describe("환경 변수 검증 모듈", () => {
  const VALID_ENV = {
    GEMINI_API_KEY: "test-api-key-123",
    QDRANT_URL: "http://localhost:6333",
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD: "password123",
  };

  describe("envSchema", () => {
    it("모든 필수 환경 변수가 있으면 검증을 통과한다", () => {
      const result = envSchema.safeParse(VALID_ENV);
      expect(result.success).toBe(true);
    });

    it("선택 환경 변수가 없으면 기본값을 적용한다", () => {
      const result = envSchema.parse(VALID_ENV);
      expect(result.GEMINI_LLM_MODEL).toBe("gemini-2.5-flash");
      expect(result.GEMINI_EMBEDDING_MODEL).toBe("gemini-embedding-001");
      expect(result.QDRANT_COLLECTION).toBe("knowledge_chunks");
      expect(result.DAILY_REQUEST_LIMIT).toBe(20);
    });

    it("선택 환경 변수가 있으면 해당 값을 사용한다", () => {
      const result = envSchema.parse({
        ...VALID_ENV,
        GEMINI_LLM_MODEL: "gemini-2.0-flash",
        GEMINI_EMBEDDING_MODEL: "text-embedding-004",
        QDRANT_COLLECTION: "my_collection",
        DAILY_REQUEST_LIMIT: "50",
      });
      expect(result.GEMINI_LLM_MODEL).toBe("gemini-2.0-flash");
      expect(result.GEMINI_EMBEDDING_MODEL).toBe("text-embedding-004");
      expect(result.QDRANT_COLLECTION).toBe("my_collection");
      expect(result.DAILY_REQUEST_LIMIT).toBe(50);
    });

    it("GEMINI_API_KEY가 없으면 검증에 실패한다", () => {
      const { GEMINI_API_KEY, ...rest } = VALID_ENV;
      const result = envSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it("QDRANT_URL이 없으면 검증에 실패한다", () => {
      const { QDRANT_URL, ...rest } = VALID_ENV;
      const result = envSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it("ADMIN_USERNAME이 없으면 검증에 실패한다", () => {
      const { ADMIN_USERNAME, ...rest } = VALID_ENV;
      const result = envSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it("ADMIN_PASSWORD가 없으면 검증에 실패한다", () => {
      const { ADMIN_PASSWORD, ...rest } = VALID_ENV;
      const result = envSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it("GEMINI_API_KEY가 빈 문자열이면 검증에 실패한다", () => {
      const result = envSchema.safeParse({
        ...VALID_ENV,
        GEMINI_API_KEY: "",
      });
      expect(result.success).toBe(false);
    });

    it("QDRANT_URL이 유효하지 않은 URL이면 검증에 실패한다", () => {
      const result = envSchema.safeParse({
        ...VALID_ENV,
        QDRANT_URL: "not-a-url",
      });
      expect(result.success).toBe(false);
    });

    it("DAILY_REQUEST_LIMIT이 문자열 숫자이면 숫자로 변환한다", () => {
      const result = envSchema.parse({
        ...VALID_ENV,
        DAILY_REQUEST_LIMIT: "30",
      });
      expect(result.DAILY_REQUEST_LIMIT).toBe(30);
    });
  });

  describe("validateEnv", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
      originalEnv = { ...process.env };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("유효한 환경 변수가 설정되면 검증된 설정을 반환한다", () => {
      Object.assign(process.env, VALID_ENV);
      const env = validateEnv();
      expect(env.GEMINI_API_KEY).toBe("test-api-key-123");
      expect(env.QDRANT_URL).toBe("http://localhost:6333");
      expect(env.ADMIN_USERNAME).toBe("admin");
      expect(env.ADMIN_PASSWORD).toBe("password123");
      expect(env.GEMINI_LLM_MODEL).toBe("gemini-2.5-flash");
    });

    it("필수 환경 변수가 없으면 오류를 발생시킨다", () => {
      // process.env에서 필수 변수 제거
      delete process.env.GEMINI_API_KEY;
      delete process.env.QDRANT_URL;
      delete process.env.ADMIN_USERNAME;
      delete process.env.ADMIN_PASSWORD;

      expect(() => validateEnv()).toThrow("환경 변수 검증 실패");
    });

    it("오류 메시지에 누락된 변수 정보가 포함된다", () => {
      delete process.env.GEMINI_API_KEY;
      delete process.env.QDRANT_URL;
      delete process.env.ADMIN_USERNAME;
      delete process.env.ADMIN_PASSWORD;

      expect(() => validateEnv()).toThrow("GEMINI_API_KEY");
    });
  });
});
