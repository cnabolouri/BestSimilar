"use client";

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
  
  useEffect(() => {
  async function loadStatus() {
    try {
      const status = await getTitleInteractionStatus(titleSlug);
      setFavorite(status.is_favorite);
      setWatchlist(status.in_watchlist);
      setWatched(status.is_watched);
    } catch {
      // user not signed in
    }
  }

  loadStatus();
}, [titleSlug]);

  const [favorite, setFavorite] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [watched, setWatched] = useState(false);

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
      alert("Sign in to favorite titles.");
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
      alert("Sign in to save to watchlist.");
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
        alert("Sign in to mark titles as watched.");
    }
    }

  return (
    <div className="absolute right-2 top-2 z-20 flex gap-1">
      <button
        onClick={toggleFavorite}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-sm transition",
          favorite
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-background/85 text-foreground backdrop-blur hover:border-accent",
        ].join(" ")}
        title="Favorite"
      >
        ★
      </button>

      <button
        onClick={toggleWatchlist}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-sm transition",
          watchlist
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background/85 text-foreground backdrop-blur hover:border-accent",
        ].join(" ")}
        title="Watchlist"
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
        title="Watched"
      >
        👁
      </button>
    </div>
  );
}