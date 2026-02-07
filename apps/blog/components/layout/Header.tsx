"use client";

import { useTheme } from "next-themes";
import { Header as SharedHeader } from "@repo/ui/header";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <SharedHeader
      subdomain="log"
      logoHref="/"
      showThemeToggle={true}
      currentTheme={resolvedTheme as "light" | "dark"}
      onThemeToggle={handleThemeToggle}
    />
  );
}
