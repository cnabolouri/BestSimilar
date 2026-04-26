"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/layout/theme-provider";

export function FooterThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group inline-flex h-10 w-[76px] items-center rounded-full border border-border bg-background p-1 shadow-sm transition hover:border-accent/70 hover:shadow-md"
    >
      <motion.span
        layout
        animate={{ x: isDark ? 34 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base text-accent-foreground shadow-sm"
      >
        {isDark ? "☀️" : "🌙"}
      </motion.span>
    </button>
  );
}