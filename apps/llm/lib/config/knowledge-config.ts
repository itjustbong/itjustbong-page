import fs from "fs";
import path from "path";
import { z } from "zod";
import { parse as parseYaml } from "yaml";
import type { KnowledgeConfig, ValidationResult } from "../types";

// ============================================================
// Zod 스키마 정의
// ============================================================

const knowledgeSourceSchema = z.object({
  url: z.string().url("유효한 URL 형식이어야 합니다"),
  title: z.string().min(1, "title은 필수입니다"),
  category: z.string().min(1, "category는 필수입니다"),
  type: z.enum(["url", "text"]).default("url"),
  content: z.string().optional(),
});

const knowledgeConfigSchema = z.object({
  sources: z
    .array(knowledgeSourceSchema)
    .min(1, "최소 하나 이상의 소스가 필요합니다"),
});

// ============================================================
// 파일 파싱
// ============================================================

/** 파일 확장자에 따라 JSON 또는 YAML로 파싱한다 */
function parseFileContent(filePath: string, content: string): unknown {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".json") {
    return JSON.parse(content);
  }

  if (ext === ".yaml" || ext === ".yml") {
    return parseYaml(content);
  }

  throw new Error(
    `지원하지 않는 파일 형식입니다: ${ext} (지원 형식: .json, .yaml, .yml)`
  );
}

// ============================================================
// 검증
// ============================================================

/** Knowledge Config 객체를 검증한다 */
function validateKnowledgeConfig(config: unknown): ValidationResult {
  const result = knowledgeConfigSchema.safeParse(config);

  if (result.success) {
    return { success: true };
  }

  const errors = result.error.issues.map((issue) => {
    const fieldPath = issue.path.join(".");
    return `${fieldPath}: ${issue.message}`;
  });

  return { success: false, errors };
}

// ============================================================
// 로더
// ============================================================

/** 설정 파일을 로드하고 검증하여 KnowledgeConfig를 반환한다 */
function loadKnowledgeConfig(filePath: string): KnowledgeConfig {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`설정 파일을 찾을 수 없습니다: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, "utf-8");
  const parsed = parseFileContent(absolutePath, content);
  const validation = validateKnowledgeConfig(parsed);

  if (!validation.success) {
    throw new Error(
      `설정 파일 검증 실패:\n${validation.errors?.join("\n")}`
    );
  }

  return knowledgeConfigSchema.parse(parsed);
}

export {
  knowledgeSourceSchema,
  knowledgeConfigSchema,
  parseFileContent,
  validateKnowledgeConfig,
  loadKnowledgeConfig,
};
