"use client";

import { Moon, Sun } from "lucide-react";

export interface ThemeToggleProps {
  /** 현재 테마 ("light" | "dark") */
  currentTheme?: "light" | "dark";
  /** 테마 전환 시 호출되는 콜백 */
  onToggle?: () => void;
}

export function ThemeToggle({ currentTheme, onToggle }: ThemeToggleProps) {
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={onToggle}
      className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="테마 전환"
    >
      <Sun
        className={`h-4 w-4 transition-transform duration-200 ${
          isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-transform duration-200 ${
          isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">테마 전환</span>
    </button>
  );
}
