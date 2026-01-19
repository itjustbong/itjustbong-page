import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { FileText } from "lucide-react";

export default async function AdminLoginPage() {
  // 이미 인증된 경우 대시보드로 리다이렉트
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="from-primary via-primary/90 to-primary/80 hidden w-1/2 bg-gradient-to-br lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">Tech Blog</h1>
          <p className="text-lg text-white/80">
            블로그 콘텐츠를 관리하고 새로운 글을 작성하세요.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-background flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="bg-primary mb-4 flex h-16 w-16 items-center justify-center rounded-xl">
              <FileText className="text-primary-foreground h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">Tech Blog</h1>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
