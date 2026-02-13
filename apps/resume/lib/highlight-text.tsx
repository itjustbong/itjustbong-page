"use client";

import type { ReactNode } from "react";

/**
 * 텍스트 강조 유틸리티
 *
 * 마크다운 스타일 문법 지원:
 * - **텍스트** : Bold (굵은 글씨로 강조)
 * - *텍스트* : 이탤릭 (보조 강조)
 * - `텍스트` : Bold (기술명·도구명 등, bold와 동일 스타일)
 * - ~~텍스트~~ : 취소선
 *
 * **bold**와 `code`는 동일한 굵은 글씨로 통일하여 가독성을 높였습니다.
 */

type HighlightType = "bold" | "italic" | "code" | "strike";

interface ParsedSegment {
  type: "text" | HighlightType;
  content: string;
}

// 정규식 패턴 정의 (순서 중요: 더 긴 패턴이 먼저 매칭되어야 함)
// bold(**) -> strike(~~) -> code(`) -> italic(*) 순서
const patterns: { type: HighlightType; regex: RegExp; priority: number }[] = [
  { type: "bold", regex: /\*\*(.+?)\*\*/g, priority: 1 },
  { type: "strike", regex: /~~([^~]+)~~/g, priority: 2 },
  { type: "code", regex: /`([^`]+)`/g, priority: 3 },
  // 이탤릭: *내용* 형태에서 내용이 공백으로 시작/끝나지 않아야 함
  { type: "italic", regex: /\*([^\s*][^*]*[^\s*]|[^\s*])\*/g, priority: 4 },
];

function parseText(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];

  // 모든 패턴 매치를 찾아서 위치와 함께 저장
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

  // 위치순 정렬, 같은 위치면 priority가 낮은 것(더 긴 패턴) 우선
  allMatches.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return a.priority - b.priority;
  });

  // 겹치는 매치 제거 (먼저 나온 것, priority 낮은 것 우선)
  const filteredMatches: Match[] = [];
  let lastEnd = 0;

  for (const match of allMatches) {
    if (match.index >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.index + match.length;
    }
  }

  // 세그먼트 생성
  let currentIndex = 0;

  for (const match of filteredMatches) {
    // 매치 이전의 일반 텍스트
    if (match.index > currentIndex) {
      segments.push({
        type: "text",
        content: text.slice(currentIndex, match.index),
      });
    }

    // 매치된 강조 텍스트
    segments.push({
      type: match.type,
      content: match.content,
    });

    currentIndex = match.index + match.length;
  }

  // 남은 텍스트
  if (currentIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(currentIndex),
    });
  }

  return segments;
}

const boldClassName = "font-semibold text-foreground";

function renderSegment(segment: ParsedSegment, index: number): ReactNode {
  switch (segment.type) {
    case "bold":
      return (
        <strong key={index} className={boldClassName}>
          {segment.content}
        </strong>
      );
    case "italic":
      return (
        <span key={index} className="text-muted-foreground italic">
          {segment.content}
        </span>
      );
    case "code":
      return (
        <strong key={index} className={boldClassName}>
          {segment.content}
        </strong>
      );
    case "strike":
      return (
        <del key={index} className="text-muted-foreground line-through">
          {segment.content}
        </del>
      );
    default:
      return <span key={index}>{segment.content}</span>;
  }
}

export function HighlightText({ text }: { text: string }): ReactNode {
  const segments = parseText(text);
  return <>{segments.map((segment, index) => renderSegment(segment, index))}</>;
}

// 배열의 각 항목에 강조 적용
export function HighlightList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}): ReactNode {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index}>
          <HighlightText text={item} />
        </li>
      ))}
    </ul>
  );
}
