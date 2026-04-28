"use client";

import { useEffect, useRef, useState } from "react";
import {
  getTitleInteractionStatus,
  rateTitle,
  removeRating,
} from "@/services/interactions";

export function RatingStar({ titleSlug }: { titleSlug: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const status = await getTitleInteractionStatus(titleSlug);
        setRating(status.user_rating);
      } catch {}
    }

    load();
  }, [titleSlug]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleRate(value: number) {
    await rateTitle({ titleSlug, rating: value });
    setRating(value);
    setOpen(false);
  }

  async function handleRemove() {
    await removeRating(titleSlug);
    setRating(null);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* STAR BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition",
          rating
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-background text-foreground hover:border-accent",
        ].join(" ")}
      >
        {rating ? rating : "★"}
      </button>

      {/* EXPANDED PANEL */}
      {open && (
        <div className="absolute left-0 top-12 z-50 w-64 rounded-2xl border border-border bg-background p-3 shadow-xl">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Your rating
          </p>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }).map((_, i) => {
              const value = i + 1;
              const active = rating === value;

              return (
                <button
                  key={value}
                  onClick={() => handleRate(value)}
                  className={[
                    "h-8 w-8 rounded-full border text-xs font-semibold transition",
                    active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-accent",
                  ].join(" ")}
                >
                  {value}
                </button>
              );
            })}
          </div>

          {rating && (
            <button
              onClick={handleRemove}
              className="mt-3 text-xs text-red-400 hover:underline"
            >
              Remove rating
            </button>
          )}
        </div>
      )}
    </div>
  );
}