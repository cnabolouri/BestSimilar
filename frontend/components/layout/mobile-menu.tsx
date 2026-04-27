"use client";

import Link from "next/link";
import { useState } from "react";
import { HeaderSearch } from "@/components/layout/header-search";
// import { HeaderAuthStatus } from "@/components/layout/header-auth-status";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Movies", href: "/movies" },
  { label: "TV Shows", href: "/tv" },
  { label: "People", href: "/people" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-lg"
        aria-label="Toggle menu"
      >
        {open ? "×" : "☰"}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu backdrop"
            onClick={closeMenu}
            className="fixed inset-0 top-20 z-40 bg-background/60 backdrop-blur-sm"
          />

          <div className="absolute left-0 right-0 top-20 z-50 border-b border-border bg-background px-6 py-5 shadow-lg">
            <div className="space-y-5">
              <HeaderSearch onSearch={closeMenu} />

              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium transition hover:border-accent/60"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* <div className="border-t border-border pt-4">
                <HeaderAuthStatus onAction={closeMenu} />
              </div> */}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}