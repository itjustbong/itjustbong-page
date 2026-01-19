import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 404 숫자 */}
        <h1 className="from-primary to-primary/50 bg-gradient-to-r bg-clip-text text-8xl font-bold text-transparent md:text-9xl">
          404
        </h1>

        {/* 메시지 */}
        <h2 className="mt-4 text-2xl font-semibold md:text-3xl">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          요청하신 페이지가 존재하지 않거나, 이동되었거나, 삭제되었을 수
          있습니다.
        </p>

        {/* 버튼 */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 가기
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              이전 페이지
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
