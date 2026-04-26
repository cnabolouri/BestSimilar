import Link from "next/link";
import { LogoLockup } from "@/components/branding/logo-lockup";
import { FooterThemeToggle } from "@/components/layout/footer-theme-toggle";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <LogoLockup />

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="transition hover:text-foreground">
              About
            </Link>
            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
            <Link href="/credits" className="transition hover:text-foreground">
              Credits
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            Simcine helps you discover movies and shows by meaning, tone, and semantic similarity.
          </p>

          <FooterThemeToggle />
        </div>
      </div>
    </footer>
  );
}