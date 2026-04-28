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
    <div className="pointer-events-none absolute right-2 top-2 z-20 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">        <button
        onClick={toggleFavorite}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-sm transition",
          favorite
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background/85 text-foreground backdrop-blur hover:border-accent",
        ].join(" ")}
        title="Favorite person"
      >
        {favorite ? "♥" : "♡"}
      </button>
    </div>
  );
}