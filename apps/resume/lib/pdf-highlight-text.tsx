"use client";

import type { ReactNode, CSSProperties } from "react";

/**
 * PDF용 텍스트 강조 유틸리티
 * html2canvas가 oklch 색상을 지원하지 않으므로 인라인 스타일로 hex 색상 사용
 */

type HighlightType = "bold" | "italic" | "code" | "strike";

interface ParsedSegment {
  type: "text" | HighlightType;
  content: string;
}

const patterns: { type: HighlightType; regex: RegExp; priority: number }[] = [
  { type: "bold", regex: /\*\*(.+?)\*\*/g, priority: 1 },
  { type: "strike", regex: /~~([^~]+)~~/g, priority: 2 },
  { type: "code", regex: /`([^`]+)`/g, priority: 3 },
  // 이탤릭: *내용* 형태에서 내용이 공백으로 시작/끝나지 않아야 함
  { type: "italic", regex: /\*([^\s*][^*]*[^\s*]|[^\s*])\*/g, priority: 4 },
];

function parseText(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];

  interface Match {
    index: number;
    length: number;
    type: HighlightType;
    content: string;
    priority: number;
  }

  const allMatches: Match[] = [];

  for (const { type, regex, priority } of patterns) {
    const localRegex = new RegExp(regex.source, "g");
    let match: RegExpExecArray | null;

    while ((match = localRegex.exec(text)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type,
        content: match[1],
        priority,
      });
    }
  }

  allMatches.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return a.priority - b.priority;
  });

  const filteredMatches: Match[] = [];
  let lastEnd = 0;

  for (const match of allMatches) {
    if (match.index >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.index + match.length;
    }
  }

  let currentIndex = 0;

  for (const match of filteredMatches) {
    if (match.index > currentIndex) {
      segments.push({
        type: "text",
        content: text.slice(currentIndex, match.index),
      });
    }

    segments.push({
      type: match.type,
      content: match.content,
    });

    currentIndex = match.index + match.length;
  }

  if (currentIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(currentIndex),
    });
  }

  return segments;
}

// PDF용 인라인 스타일 (hex 색상만 사용)
const styles: Record<HighlightType | "text", CSSProperties> = {
  bold: {
    fontWeight: 600,
    color: "#1a1a1a",
  },
  italic: {
    fontStyle: "normal",
    color: "#0891b2",
  },
  code: {
    color: "#0891b2",
    fontWeight: 500,
  },
  strike: {
    textDecoration: "line-through",
    color: "#666666",
  },
  text: {},
};

function renderSegment(segment: ParsedSegment, index: number): ReactNode {
  const style = styles[segment.type];
  return (
    <span key={index} style={style}>
      {segment.content}
    </span>
  );
}

export function PdfHighlightText({ text }: { text: string }): ReactNode {
  const segments = parseText(text);
  return <>{segments.map((segment, index) => renderSegment(segment, index))}</>;
}
