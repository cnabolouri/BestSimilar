"use client";

import { useState } from "react";
import { addFavoritePerson, removeFavoritePerson } from "@/services/interactions";

export function PersonActions({ personSlug }: { personSlug: string }) {
  const [favorited, setFavorited] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function toggleFavorite() {
    setMessage(null);

    try {
      if (favorited) {
        await removeFavoritePerson(personSlug);
        setFavorited(false);
        setMessage("Removed from favorites.");
      } else {
        await addFavoritePerson(personSlug);
        setFavorited(true);
        setMessage("Added to favorites.");
      }
    } catch {
      setMessage("Sign in to favorite people.");
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={toggleFavorite}
        className={[
          "rounded-full border px-4 py-2 text-sm font-semibold transition",
          favorited
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-background text-foreground hover:border-accent/60",
        ].join(" ")}
      >
        {favorited ? "♥ Favorite person" : "♡ Add to favorite people"}
      </button>

      {message ? <p className="mt-3 text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}