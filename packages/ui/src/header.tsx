"use client";

import Image from "next/image";
import { ThemeToggle, type ThemeToggleProps } from "./theme-toggle";
import { InfoPopup } from "./info-popup";

export interface HeaderProps {
  /** 서브도메인 이름 (예: "log", "llm", "resume") */
  subdomain: string;
  /** 로고 클릭 시 이동할 URL */
  logoHref?: string;
  /** 로고 이미지 경로 */
  logoSrc?: string;
  /** ThemeToggle 표시 여부 */
  showThemeToggle?: boolean;
  /** 현재 테마 */
  currentTheme?: ThemeToggleProps["currentTheme"];
  /** 테마 전환 콜백 */
  onThemeToggle?: ThemeToggleProps["onToggle"];
}

export function Header({
  subdomain,
  logoHref = "/",
  logoSrc = "/icon/icon-192.png",
  showThemeToggle = true,
  currentTheme,
  onThemeToggle,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a
          href={logoHref}
          className="font-mono text-base transition-opacity hover:opacity-80"
        >
          <Image
            src={logoSrc}
            alt="logo"
            width={20}
            height={20}
            className="mr-1.5 inline-block"
          />
          <span className="text-primary">{"<"}</span>
          <span className="font-semibold">{subdomain}</span>
          <span className="text-muted-foreground">.itjustbong</span>
          <span className="text-primary">{" />"}</span>
        </a>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {showThemeToggle && (
            <ThemeToggle
              currentTheme={currentTheme}
              onToggle={onThemeToggle}
            />
          )}
          <InfoPopup />
        </div>
      </div>
    </header>
  );
}
