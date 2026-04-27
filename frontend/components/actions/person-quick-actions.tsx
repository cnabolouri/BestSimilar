"use client";

import { useState } from "react";
import { addFavoritePerson, removeFavoritePerson } from "@/services/interactions";

export function PersonQuickActions({ personSlug }: { personSlug: string }) {
  const [favorite, setFavorite] = useState(false);

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (favorite) {
        await removeFavoritePerson(personSlug);
        setFavorite(false);
      } else {
        await addFavoritePerson(personSlug);
        setFavorite(true);
      }
    } catch {
      alert("Sign in to favorite people.");
    }
  }

  return (
    <div className="absolute right-2 top-2 z-20">
      <button
        onClick={toggleFavorite}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-sm transition",
          favorite
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-background/85 text-foreground backdrop-blur hover:border-accent",
        ].join(" ")}
        title="Favorite person"
      >
        ★
      </button>
    </div>
  );
}