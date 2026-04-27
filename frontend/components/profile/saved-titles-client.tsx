"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SavedTitleItem } from "@/services/interactions";
import { removeFavoriteTitle, removeFromWatchlist, removeWatchedTitle } from "@/services/interactions";
import { tmdbPosterUrl } from "@/lib/images";
import { ProfileSuggestionsClient } from "@/components/profile/profile-suggestions-client";

export function SavedTitlesClient({
  title,
  description,
  items,
  type,
  compactHeader = false,
}: {
  title: string;
  description: string;
  items: SavedTitleItem[];
  type: "watchlist" | "favorites" | "history";
  compactHeader?: boolean;
}) {
  const [savedItems, setSavedItems] = useState(items);

  async function handleRemove(item: SavedTitleItem) {
    if (type === "watchlist") {
      await removeFromWatchlist(item.title_slug);
    } else if (type === "favorites") {
      await removeFavoriteTitle(item.title_slug);
    } else {
      await removeWatchedTitle(item.title_slug);
    }

    setSavedItems((current) =>
      current.filter((entry) => entry.title_slug !== item.title_slug)
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      {!compactHeader ? (
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      ) : null}

      {savedItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-sm text-muted-foreground">
          Nothing saved yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {savedItems.map((item) => {
            const href =
              item.media_type === "movie"
                ? `/movie/${item.title_slug}`
                : `/tv/${item.title_slug}`;

            const posterUrl = tmdbPosterUrl(item.poster_url);

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-border bg-card p-3"
              >
                <Link href={href}>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={item.title_name}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold">
                    {item.title_name}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.media_type.toUpperCase()}
                  </p>
                </Link>

                <button
                  onClick={() => handleRemove(item)}
                  className="mt-3 w-full rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-red-400 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Recommendations Section */}
      {savedItems.length > 0 ? (
        <div className="mt-16">
          <ProfileSuggestionsClient
            sourceItems={savedItems}
            title={
              type === "watchlist"
                ? "More like your watchlist"
                : type === "history"
                  ? "Because you watched these"
                  : "More like your favorites"
            }
            description={
              type === "watchlist"
                ? "Similar titles based on what you saved to watch later."
                : type === "history"
                  ? "Recommendations based on titles you marked as watched."
                  : "Similar titles based on your favorite movies and shows."
            }
          />
        </div>
      ) : null}
    </div>
  );
}