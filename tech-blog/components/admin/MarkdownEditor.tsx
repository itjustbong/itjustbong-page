"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Code,
  Quote,
  Image as ImageIcon,
  Eye,
  Pencil,
  Code2,
  Minus,
  CheckSquare,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onImageClick?: () => void;
}

type ToolbarAction =
  | { type: "wrap"; before: string; after: string; placeholder: string }
  | { type: "lineStart"; prefix: string }
  | { type: "block"; template: string };

interface ToolbarButtonConfig {
  icon: React.ReactNode;
  label: string;
  action: ToolbarAction;
  shortcut?: string;
}

const TOOLBAR_GROUPS: ToolbarButtonConfig[][] = [
  // 텍스트 스타일
  [
    {
      icon: <Bold className="size-4" />,
      label: "굵게",
      action: {
        type: "wrap",
        before: "**",
        after: "**",
        placeholder: "굵은 텍스트",
      },
      shortcut: "Ctrl+B",
    },
    {
      icon: <Italic className="size-4" />,
      label: "기울임",
      action: {
        type: "wrap",
        before: "*",
        after: "*",
        placeholder: "기울임 텍스트",
      },
      shortcut: "Ctrl+I",
    },
    {
      icon: <Code className="size-4" />,
      label: "인라인 코드",
      action: { type: "wrap", before: "`", after: "`", placeholder: "코드" },
    },
  ],
  // 제목
  [
    {
      icon: <Heading1 className="size-4" />,
      label: "제목 1",
      action: { type: "lineStart", prefix: "# " },
    },
    {
      icon: <Heading2 className="size-4" />,
      label: "제목 2",
      action: { type: "lineStart", prefix: "## " },
    },
    {
      icon: <Heading3 className="size-4" />,
      label: "제목 3",
      action: { type: "lineStart", prefix: "### " },
    },
  ],
  // 목록
  [
    {
      icon: <List className="size-4" />,
      label: "목록",
      action: { type: "lineStart", prefix: "- " },
    },
    {
      icon: <ListOrdered className="size-4" />,
      label: "번호 목록",
      action: { type: "lineStart", prefix: "1. " },
    },
    {
      icon: <CheckSquare className="size-4" />,
      label: "체크리스트",
      action: { type: "lineStart", prefix: "- [ ] " },
    },
  ],
  // 블록
  [
    {
      icon: <Quote className="size-4" />,
      label: "인용",
      action: { type: "lineStart", prefix: "> " },
    },
    {
      icon: <Code2 className="size-4" />,
      label: "코드 블록",
      action: {
        type: "block",
        template: "```javascript\n코드를 입력하세요\n```",
      },
    },
    {
      icon: <Minus className="size-4" />,
      label: "구분선",
      action: { type: "block", template: "\n---\n" },
    },
  ],
  // 링크/이미지
  [
    {
      icon: <Link className="size-4" />,
      label: "링크",
      action: {
        type: "wrap",
        before: "[",
        after: "](url)",
        placeholder: "링크 텍스트",
      },
      shortcut: "Ctrl+K",
    },
    {
      icon: <ImageIcon className="size-4" />,
      label: "이미지",
      action: {
        type: "wrap",
        before: "![",
        after: "](url)",
        placeholder: "이미지 설명",
      },
    },
  ],
];

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "마크다운으로 글을 작성하세요...",
  className,
  onImageClick,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (
    before: string,
    after: string = "",
    placeholderText: string = ""
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholderText;

    const newValue =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + textToInsert.length
      );
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const newValue =
      value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const insertBlock = (template: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue =
      value.substring(0, start) + template + value.substring(start);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + template.length,
        start + template.length
      );
    }, 0);
  };

  const handleToolbarClick = (action: ToolbarAction) => {
    if (action.type === "wrap") {
      insertText(action.before, action.after, action.placeholder);
    } else if (action.type === "lineStart") {
      insertAtLineStart(action.prefix);
    } else if (action.type === "block") {
      insertBlock(action.template);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertText("  ");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      insertText("**", "**", "굵은 텍스트");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      insertText("*", "*", "기울임 텍스트");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      insertText("[", "](url)", "링크 텍스트");
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* 툴바 */}
      <div className="border-border/50 bg-muted/30 flex items-center justify-between border-b px-2 py-1.5">
        <div className="flex items-center gap-1 overflow-x-auto">
          {TOOLBAR_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex} className="flex items-center">
              {group.map((button, buttonIndex) => (
                <Button
                  key={buttonIndex}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (button.label === "이미지" && onImageClick) {
                      onImageClick();
                    } else {
                      handleToolbarClick(button.action);
                    }
                  }}
                  title={
                    button.shortcut
                      ? `${button.label} (${button.shortcut})`
                      : button.label
                  }
                  className="text-muted-foreground hover:bg-primary/10 hover:text-primary h-8 w-8 p-0"
                >
                  {button.icon}
                </Button>
              ))}
              {groupIndex < TOOLBAR_GROUPS.length - 1 && (
                <div className="bg-border/50 mx-1 h-5 w-px" />
              )}
            </div>
          ))}
        </div>

        {/* 탭 전환 */}
        <div className="bg-muted/50 flex items-center rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              activeTab === "write"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            작성
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              activeTab === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            미리보기
          </button>
        </div>
      </div>

      {/* 에디터/미리보기 영역 */}
      {activeTab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "min-h-[500px] w-full resize-y bg-transparent p-6",
            "font-mono text-sm leading-relaxed",
            "placeholder:text-muted-foreground/40",
            "focus:outline-none",
            "selection:bg-primary/20"
          )}
          spellCheck={false}
        />
      ) : (
        <div className="min-h-[500px] w-full overflow-auto p-6">
          {value ? (
            <MarkdownPreview content={value} />
          ) : (
            <p className="text-muted-foreground/60 italic">
              미리볼 내용이 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// 마크다운 미리보기 컴포넌트
function MarkdownPreview({ content }: { content: string }) {
  const parseMarkdown = (md: string): string => {
    let html = md
      // 코드 블록
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, _lang, code) => {
        return `<pre class="bg-zinc-900 text-zinc-100 rounded-xl p-4 my-4 overflow-x-auto border border-zinc-800"><code class="text-sm font-mono">${escapeHtml(code.trim())}</code></pre>`;
      })
      // 인라인 코드
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      // 제목
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h3>'
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-border/50 text-foreground">$1</h2>'
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-3xl font-bold mt-10 mb-6 text-foreground">$1</h1>'
      )
      // 체크리스트
      .replace(
        /^- \[x\] (.+)$/gm,
        '<div class="flex items-center gap-2 my-1"><div class="w-4 h-4 rounded bg-primary flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><span class="line-through text-muted-foreground">$1</span></div>'
      )
      .replace(
        /^- \[ \] (.+)$/gm,
        '<div class="flex items-center gap-2 my-1"><div class="w-4 h-4 rounded border-2 border-muted-foreground/30"></div><span>$1</span></div>'
      )
      // 굵게, 기울임
      .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold'>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // 링크
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-primary hover:underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // 이미지
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="rounded-xl max-w-full my-6 shadow-lg" />'
      )
      // 인용문
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-primary/50 bg-primary/5 pl-4 py-3 my-4 text-foreground/80 italic rounded-r-lg">$1</blockquote>'
      )
      // 순서 없는 목록
      .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc my-1">$1</li>')
      // 순서 있는 목록
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal my-1">$1</li>')
      // 수평선
      .replace(/^---$/gm, '<hr class="my-8 border-border/50" />')
      // 줄바꿈
      .replace(/\n\n/g, "</p><p class='my-4 leading-relaxed'>")
      .replace(/\n/g, "<br />");

    // 연속된 li 태그를 ul/ol로 감싸기
    html = html.replace(
      /(<li class="ml-6 list-disc[\s\S]*?<\/li>)+/g,
      '<ul class="my-4 space-y-1">$&</ul>'
    );
    html = html.replace(
      /(<li class="ml-6 list-decimal[\s\S]*?<\/li>)+/g,
      '<ol class="my-4 space-y-1">$&</ol>'
    );

    return `<article class="prose-custom"><p class='my-4 leading-relaxed'>${html}</p></article>`;
  };

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <div
      className="markdown-preview text-foreground/90"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
