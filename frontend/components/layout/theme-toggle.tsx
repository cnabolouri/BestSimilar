"use client";

import { useTheme } from "@/components/layout/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}