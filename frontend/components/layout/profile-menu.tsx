"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeaderAvatar } from "@/components/layout/HeaderAvatar";
import { type ProfileUser } from "@/services/profile";

const menuItems = [
  { label: "My Profile", href: "/profile" },
  { label: "Account Settings", href: "/profile/settings" },
  { label: "Your watchlist", href: "/profile/watchlist" },
  { label: "Your favorites", href: "/profile/favorites" },
  { label: "Your ratings", href: "/profile/ratings" },
  { label: "Watch history", href: "/profile/history" },
];

export function ProfileMenu({
  user,
  onAction,
  compact = false,
}: {
  user: ProfileUser;
  onAction?: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const displayLabel = user.display_name || user.username || "Profile";

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="inline-flex h-10 overflow-hidden rounded-full border border-border bg-card transition hover:border-accent/60">
        <Link
          href="/profile"
          onClick={onAction}
          className={[
            "inline-flex items-center gap-2 text-sm font-semibold",
            compact ? "px-2.5" : "px-2.5 pr-3",
          ].join(" ")}
        >
          <HeaderAvatar
            displayName={user.display_name}
            username={user.username}
            avatarUrl={user.avatar_url}
            size="sm"
          />
          {!compact ? (
            <span className="hidden max-w-24 truncate sm:inline">
              {displayLabel}
            </span>
          ) : null}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="border-l border-border px-3 text-xs text-muted-foreground transition hover:bg-background hover:text-foreground"
          aria-label="Open profile menu"
          aria-expanded={open}
        >
          ▾
        </button>
      </div>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-3xl border border-border bg-background shadow-xl">
          <div className="border-b border-border px-4 py-4">
            <div className="flex items-center gap-3">
              <HeaderAvatar
                displayName={user.display_name}
                username={user.username}
                avatarUrl={user.avatar_url}
                size="md"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayLabel}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  @{user.username_slug || user.username}
                </p>
              </div>
            </div>
            {user.email ? (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            ) : null}
          </div>

          <div className="p-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setOpen(false);
                  onAction?.();
                }}
                className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
