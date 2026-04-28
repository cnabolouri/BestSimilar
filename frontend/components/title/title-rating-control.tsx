"use client";

import { useState } from "react";
import { rateTitle, removeRating } from "@/services/interactions";

export function TitleRatingControl({
  titleSlug,
  userRating,
  signedIn,
  onRatingChange,
  onMessage,
}: {
  titleSlug: string;
  userRating: number | null;
  signedIn: boolean;
  onRatingChange: (rating: number | null) => void;
  onMessage: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);

  async function handleRate(value: number) {
    if (!signedIn) {
      onMessage("Sign in to rate titles.");
      return;
    }

    try {
      await rateTitle({ titleSlug, rating: value });
      onRatingChange(value);
      onMessage(`Rated ${value}/10.`);
      setOpen(false);
    } catch {
      onMessage("Could not save rating.");
    }
  }

  async function handleRemove() {
    if (!signedIn) {
      onMessage("Sign in to rate titles.");
      return;
    }

    try {
      await removeRating(titleSlug);
      onRatingChange(null);
      onMessage("Rating removed.");
      setOpen(false);
    } catch {
      onMessage("Could not remove rating.");
    }
  }

  return (
    <div className="mt-3 w-full max-w-[560px] rounded-full border border-border bg-background/80 p-1 backdrop-blur">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={[
            "inline-flex h-10 min-w-12 items-center justify-center rounded-full px-3 text-sm font-bold transition",
            userRating
              ? "bg-accent text-accent-foreground"
              : "bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
          ].join(" ")}
        >
          ★ {userRating ? <span className="ml-1">{userRating}</span> : null}
        </button>

        {open ? (
          <>
            {Array.from({ length: 10 }).map((_, index) => {
              const value = index + 1;
              const active = userRating === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRate(value)}
                  className={[
                    "h-10 w-10 rounded-full text-xs font-semibold transition",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-card hover:text-foreground",
                  ].join(" ")}
                >
                  {value}
                </button>
              );
            })}

            {userRating ? (
              <button
                type="button"
                onClick={handleRemove}
                className="h-10 rounded-full px-3 text-xs font-semibold text-muted-foreground transition hover:bg-card hover:text-red-400"
              >
                Remove
              </button>
            ) : null}
          </>
        ) : (
          <span className="px-2 text-xs text-muted-foreground">
            {userRating ? "Your rating" : "Rate this"}
          </span>
        )}
      </div>
    </div>
  );
}