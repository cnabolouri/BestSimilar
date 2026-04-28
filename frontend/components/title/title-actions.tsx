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
  rateTitle,
  removeRating,
} from "@/services/interactions";
// import { RatingStar } from "@/components/actions/rating-star";
import { TitleRatingControl } from "@/components/title/title-rating-control";

export function TitleActions({ titleSlug }: { titleSlug: string }) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const status = await getTitleInteractionStatus(titleSlug);
        setUserRating(status.user_rating);
        setInWatchlist(status.in_watchlist);
        setIsFavorite(status.is_favorite);
        setIsWatched(status.is_watched);
        setSignedIn(true);
      } catch {
        setSignedIn(false);
      }
    }

    loadStatus();
  }, [titleSlug]);

  function requireSignIn() {
    if (!signedIn) {
      setMessage("Sign in to save titles.");
      return true;
    }
    return false;
  }

  async function toggleWatchlist() {
    if (requireSignIn()) return;

    setLoading(true);
    setMessage(null);

    try {
      if (inWatchlist) {
        await removeFromWatchlist(titleSlug);
        setInWatchlist(false);
        setMessage("Removed from watchlist.");
      } else {
        await addToWatchlist(titleSlug);
        setInWatchlist(true);
        setMessage("Added to watchlist.");
      }
    } catch {
      setMessage("Could not update watchlist.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite() {
    if (requireSignIn()) return;

    setLoading(true);
    setMessage(null);

    try {
      if (isFavorite) {
        await removeFavoriteTitle(titleSlug);
        setIsFavorite(false);
        setMessage("Removed from favorites.");
      } else {
        await addFavoriteTitle(titleSlug);
        setIsFavorite(true);
        setMessage("Added to favorites.");
      }
    } catch {
      setMessage("Could not update favorites.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRate(value: number) {
    if (requireSignIn()) return;

    setLoading(true);
    setMessage(null);

    try {
      await rateTitle({ titleSlug, rating: value });
      setUserRating(value);
      setMessage(`Rated ${value}/10.`);
    } catch {
      setMessage("Could not save rating.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveRating() {
    if (requireSignIn()) return;

    setLoading(true);
    setMessage(null);

    try {
      await removeRating(titleSlug);
      setUserRating(null);
      setMessage("Rating removed.");
    } catch {
      setMessage("Could not remove rating.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleWatched() {
    if (requireSignIn()) return;

    setLoading(true);
    setMessage(null);

    try {
      if (isWatched) {
        await removeWatchedTitle(titleSlug);
        setIsWatched(false);
        setMessage("Removed from watch history.");
      } else {
        await addWatchedTitle(titleSlug);
        setIsWatched(true);
        setMessage("Marked as watched.");
      }
    } catch {
      setMessage("Could not update watch history.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={toggleWatchlist}
          disabled={loading}
          className={[
            "rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60",
            inWatchlist
              ? "border border-accent bg-background text-accent"
              : "bg-accent text-accent-foreground hover:opacity-90",
          ].join(" ")}
        >
          {inWatchlist ? "✓ In watchlist" : "+ Add to watchlist"}
        </button>

        <button
          onClick={toggleFavorite}
          disabled={loading}
          className={[
            "rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60",
            isFavorite
              ? "border-accent bg-accent/10 text-accent"
              : "border-border bg-background text-foreground hover:border-accent/60",
          ].join(" ")}
        >
          {isFavorite ? "♥ Favorited" : "♡ Add to favorites"}
        </button>

        <button
          onClick={toggleWatched}
          disabled={loading}
          className={[
            "rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60",
            isWatched
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground hover:border-accent/60",
          ].join(" ")}
        >
          {isWatched ? "👁 Watched" : "👁 Mark watched"}
        </button>
        {/* <RatingStar titleSlug={titleSlug} /> */}
        {/* <TitleRatingControl
          titleSlug={titleSlug}
          userRating={userRating}
          signedIn={signedIn}
          onRatingChange={setUserRating}
          onMessage={setMessage}
        /> */}
      </div>
      <TitleRatingControl
        titleSlug={titleSlug}
        userRating={userRating}
        signedIn={signedIn}
        onRatingChange={setUserRating}
        onMessage={setMessage}
      />
    </div>
  );
}