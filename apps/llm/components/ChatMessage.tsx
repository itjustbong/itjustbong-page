"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SourceCards } from "./SourceCards";
import { User, Sparkles } from "lucide-react";
import type { SourceCard } from "@/lib/types";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: SourceCard[];
  isStreaming?: boolean;
}

/**
 * 답변 텍스트에서 출처 정보를 파싱합니다.
 * 프롬프트에서 지정한 형식:
 * > 📚 **참고 문서**
 * > - [제목](URL)
 */
function parseSourcesFromContent(content: string): {
  sources: SourceCard[];
  cleanContent: string;
} {
  const sources: SourceCard[] = [];

  // 참고 문서 블록을 찾아서 파싱
  const sourceBlockRegex =
    /> 📚 \*\*참고 문서\*\*\n((?:> - \[.+?\]\(.+?\)\n?)+)/g;
  const linkRegex = /> - \[(.+?)\]\((.+?)\)/g;

  let cleanContent = content;

  // 참고 문서 블록 찾기
  const blockMatch = sourceBlockRegex.exec(content);
  if (blockMatch) {
    const linksBlock = blockMatch[0];
    let match;

    // 각 링크 파싱
    while ((match = linkRegex.exec(linksBlock)) !== null) {
      sources.push({
        title: match[1],
        url: match[2],
        category: guessCategoryFromUrl(match[2]),
      });
    }

    // 참고 문서 블록 제거
    cleanContent = content.replace(sourceBlockRegex, "").trim();
  }

  return { sources, cleanContent };
}

function guessCategoryFromUrl(url: string): string {
  if (url.includes("blog") || url.includes("post")) return "블로그";
  if (url.includes("resume") || url.includes("career")) return "이력서";
  if (url.includes("project")) return "프로젝트";
  return "문서";
}

export function ChatMessage({
  role,
  content,
  sources: externalSources,
  isStreaming,
}: ChatMessageProps) {
  // 사용자 메시지
  if (role === "user") {
    return (
      <div className="animate-message-in flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 pt-1">
          <p className="text-sm font-medium text-foreground">{content}</p>
        </div>
      </div>
    );
  }

  // 어시스턴트 메시지
  const { sources: parsedSources, cleanContent } =
    parseSourcesFromContent(content);
  const sources = externalSources ?? parsedSources;

  return (
    <div className="animate-message-in">
      {/* 어시스턴트 아이콘과 라벨 */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/30">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">AI 답변</span>
        {isStreaming && (
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">생성 중</span>
          </span>
        )}
      </div>

      {/* 출처 섹션 - 응답과 명확히 분리 */}
      {sources.length > 0 && !isStreaming && (
        <div className="mb-4 ml-10">
          <SourceCards sources={sources} />
        </div>
      )}

      {/* 답변 본문 */}
      <div className="ml-10">
        <div className="rounded-2xl border border-border/50 bg-card/50 px-5 py-4">
          <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-ul:text-foreground/90 prose-li:text-foreground/90">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code
                        className="rounded-md bg-muted px-1.5 py-0.5 text-sm font-medium"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {cleanContent || content}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}
