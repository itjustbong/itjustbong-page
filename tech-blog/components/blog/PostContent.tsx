import { compileMDXContent } from "@/lib/mdx";
import { cn } from "@/lib/utils";

interface PostContentProps {
  content: string;
  className?: string;
}

export async function PostContent({ content, className }: PostContentProps) {
  const { content: mdxContent } = await compileMDXContent(content);

  return (
    <article
      className={cn(
        "prose prose-lg dark:prose-invert max-w-none",
        // 전체 타이포그래피 최적화
        "prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight",
        // H1 스타일
        "prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight",
        // H2 스타일 - 구분선과 여백 개선
        "prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:pb-3",
        "prose-h2:border-b prose-h2:border-border/50",
        // H3 스타일
        "prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8",
        // H4 스타일
        "prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6",
        // 본문 스타일 - 가독성 향상
        "prose-p:text-base prose-p:leading-relaxed prose-p:mb-6 prose-p:mt-0",
        "prose-p:text-foreground/85",
        // 링크 스타일 - 더 명확한 시각적 피드백
        "prose-a:text-primary prose-a:no-underline prose-a:font-medium",
        "prose-a:decoration-primary/30 prose-a:underline-offset-4",
        "hover:prose-a:underline hover:prose-a:decoration-primary",
        // 리스트 스타일 - 간격 개선
        "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2",
        "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2",
        "prose-li:my-1 prose-li:text-foreground/85 prose-li:leading-relaxed",
        // 인용문 스타일 - 더 세련된 디자인
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/40",
        "prose-blockquote:bg-muted/30 prose-blockquote:pl-6 prose-blockquote:pr-4",
        "prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:rounded-r-lg",
        "prose-blockquote:not-italic prose-blockquote:text-foreground/75",
        // 인라인 코드 스타일
        "prose-code:text-sm prose-code:bg-muted prose-code:text-foreground",
        "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
        "prose-code:font-mono prose-code:font-medium",
        "prose-code:before:content-none prose-code:after:content-none",
        // 코드 블록 스타일 - 더 나은 가독성
        "prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50",
        "prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8",
        "prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:leading-relaxed",
        "prose-pre:shadow-sm",
        // 이미지 스타일 - 더 나은 프레젠테이션
        "prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10",
        "prose-img:border prose-img:border-border/30",
        // 테이블 스타일 - 깔끔한 디자인
        "prose-table:my-8 prose-table:border-collapse prose-table:w-full",
        "prose-table:rounded-lg prose-table:overflow-hidden",
        "prose-th:border prose-th:border-border prose-th:bg-muted/50",
        "prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold",
        "prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3",
        // 구분선 - 더 부드러운 스타일
        "prose-hr:my-12 prose-hr:border-border/30",
        // Strong, em
        "prose-strong:font-bold prose-strong:text-foreground",
        "prose-em:italic prose-em:text-foreground/90",
        className
      )}
    >
      {mdxContent}
    </article>
  );
}
