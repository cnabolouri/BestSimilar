import Link from "next/link";
import { LogoLockup } from "@/components/branding/logo-lockup";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <LogoLockup href="/" />

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/credits">Credits</Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Simcine helps you discover movies and shows by meaning, tone, and semantic similarity.
        </p>
      </div>
    </footer>
  );
}