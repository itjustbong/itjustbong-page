"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  {
    title: "대시보드",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "새 글 작성",
    href: "/admin/editor",
    icon: FilePlus,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "DELETE",
    });
    window.location.href = "/admin";
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-background fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b px-4 md:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <FileText className="text-primary h-5 w-5" />
          <span className="font-semibold">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="bg-card hidden w-64 shrink-0 border-r md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b px-6">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <FileText className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-lg font-semibold">Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t p-4">
            <Link
              href="/"
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
            >
              <Home className="h-4 w-4" />
              블로그로 이동
            </Link>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-1 w-full justify-start gap-3 px-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "bg-card fixed inset-y-0 left-0 z-50 w-72 transform border-r transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col pt-16">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t p-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all"
            >
              <Home className="h-5 w-5" />
              블로그로 이동
            </Link>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-1 w-full justify-start gap-3 px-3 py-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              로그아웃
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
