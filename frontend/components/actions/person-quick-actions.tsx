"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addFavoritePerson,
  getFavoritePeople,
  removeFavoritePerson,
} from "@/services/interactions";

export function PersonQuickActions({ personSlug }: { personSlug: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const favorites = await getFavoritePeople();
        setFavorite(favorites.some((item) => item.person_slug === personSlug));
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
    }

    loadStatus();
  }, [personSlug]);

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
        await removeFavoritePerson(personSlug);
        setFavorite(false);
      } else {
        await addFavoritePerson(personSlug);
        setFavorite(true);
      }
    } catch {
      // silently ignore
    }
  }

  return (
    <div className="pointer-events-none absolute right-2 top-2 z-20 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
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
    </div>
  );
}
