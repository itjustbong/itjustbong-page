"use client";

import { ExternalLink, BookOpen } from "lucide-react";
import type { SourceCard } from "@/lib/types";

interface SourceCardsProps {
  sources: SourceCard[];
}

const categoryColors: Record<string, string> = {
  블로그: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50",
  이력서: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/50 dark:border-green-800/50",
  프로젝트: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50",
  문서: "bg-muted text-muted-foreground border-border/50",
};

function getCategoryColor(category: string): string {
  return categoryColors[category] || categoryColors["문서"];
}

export function SourceCards({ sources }: SourceCardsProps) {
  if (sources.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
      {/* 헤더 */}
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          참고 문서
        </span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
          {sources.length}
        </span>
      </div>

      {/* 출처 목록 */}
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <a
            key={`${source.url}-${index}`}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all hover:shadow-sm ${getCategoryColor(source.category)}`}
          >
            <span className="font-medium">{source.title}</span>
            <ExternalLink className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  );
}
