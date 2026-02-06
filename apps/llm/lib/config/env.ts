import { z } from "zod";

const envSchema = z.object({
  // 필수 환경 변수
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY는 필수입니다"),
  QDRANT_URL: z.string().url("QDRANT_URL은 유효한 URL이어야 합니다"),
  ADMIN_USERNAME: z.string().min(1, "ADMIN_USERNAME은 필수입니다"),
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD는 필수입니다"),

  // 선택 환경 변수 (기본값 적용)
  GEMINI_LLM_MODEL: z.string().default("gemini-2.5-flash"),
  GEMINI_EMBEDDING_MODEL: z.string().default("gemini-embedding-001"),
  QDRANT_COLLECTION: z.string().default("knowledge_chunks"),
  DAILY_REQUEST_LIMIT: z.coerce.number().int().positive().default(20),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `환경 변수 검증 실패:\n${errors}\n\n` +
        "필수 환경 변수를 확인해주세요: " +
        "GEMINI_API_KEY, QDRANT_URL, ADMIN_USERNAME, ADMIN_PASSWORD"
    );
  }

  return result.data;
}

export { envSchema, validateEnv };
export type { Env };
