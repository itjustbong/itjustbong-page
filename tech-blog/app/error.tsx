"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 에러 추적 서비스로 전송)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 아이콘 */}
        <div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <AlertTriangle className="text-destructive h-8 w-8" />
        </div>

        {/* 메시지 */}
        <h1 className="mt-6 text-2xl font-semibold md:text-3xl">
          문제가 발생했습니다
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          페이지를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>

        {/* 에러 다이제스트 (디버깅용) */}
        {error.digest && (
          <p className="text-muted-foreground mt-4 font-mono text-xs">
            Error ID: {error.digest}
          </p>
        )}

        {/* 버튼 */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
