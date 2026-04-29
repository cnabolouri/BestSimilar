"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addFavoriteTitle,
  addToWatchlist,
  addWatchedTitle,
  getTitleInteractionStatus,
  removeFavoriteTitle,
  removeFromWatchlist,
  removeWatchedTitle,
} from "@/services/interactions";

export function TitleQuickActions({ titleSlug }: { titleSlug: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const status = await getTitleInteractionStatus(titleSlug);
        setFavorite(status.is_favorite);
        setWatchlist(status.in_watchlist);
        setWatched(status.is_watched);
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
    }

    loadStatus();
  }, [titleSlug]);

  if (authenticated === null) return null;

  if (!authenticated) {
    return (
      <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex justify-center opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
          }}
          className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur"
        >
          Log in to save
        </button>
      </div>
    );
  }

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (favorite) {
        await removeFavoriteTitle(titleSlug);
        setFavorite(false);
      } else {
        await addFavoriteTitle(titleSlug);
        setFavorite(true);
      }
    } catch {
      // silently ignore
    }
  }

  async function toggleWatchlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (watchlist) {
        await removeFromWatchlist(titleSlug);
        setWatchlist(false);
      } else {
        await addToWatchlist(titleSlug);
        setWatchlist(true);
      }
    } catch {
      // silently ignore
    }
  }

  async function toggleWatched(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (watched) {
        await removeWatchedTitle(titleSlug);
        setWatched(false);
      } else {
        await addWatchedTitle(titleSlug);
        setWatched(true);
      }
    } catch {
      // silently ignore
    }
  }

  return (
    <div className="pointer-events-none absolute inset-x-2 top-2 z-20 flex justify-end gap-1 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
      <button
        onClick={toggleFavorite}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-sm transition",
          favorite
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background/85 text-foreground backdrop-blur hover:border-accent",
        ].join(" ")}
        title={favorite ? "Remove from my favorites" : "Favorite for me"}
        aria-label={favorite ? "Remove from my favorites" : "Favorite for me"}
      >
        {favorite ? "♥" : "♡"}
      </button>

      <button
        onClick={toggleWatchlist}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-sm transition",
          watchlist
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background/85 text-foreground backdrop-blur hover:border-accent",
        ].join(" ")}
        title={watchlist ? "Remove from my watchlist" : "Add to my watchlist"}
        aria-label={watchlist ? "Remove from my watchlist" : "Add to my watchlist"}
      >
        +
      </button>

      <button
        onClick={toggleWatched}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-sm transition",
          watched
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background/85 text-foreground backdrop-blur hover:border-accent",
        ].join(" ")}
        title={watched ? "Remove from my watched titles" : "Mark watched for me"}
        aria-label={watched ? "Remove from my watched titles" : "Mark watched for me"}
      >
        👁
      </button>
    </div>
  );
}
