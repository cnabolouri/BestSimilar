"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SavedTitleItem } from "@/services/interactions";
import {
  removeFavoriteTitle,
  removeFromWatchlist,
  removeWatchedTitle,
} from "@/services/interactions";
import { tmdbPosterUrl } from "@/lib/images";
import { TitleQuickActions } from "@/components/actions/title-quick-actions";
import { ProfileSuggestionsClient } from "@/components/profile/profile-suggestions-client";

type FilterType = "all" | "movie" | "tv";
type SortType = "recent" | "title" | "media";

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
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("recent");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    let result = [...savedItems];

    if (filterType !== "all") {
      result = result.filter((item) => item.media_type === filterType);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((item) =>
        item.title_name.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortType === "title") {
        return a.title_name.localeCompare(b.title_name);
      }

      if (sortType === "media") {
        return a.media_type.localeCompare(b.media_type);
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return result;
  }, [savedItems, filterType, sortType, query]);

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
    <div className={compactHeader ? "" : "mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10"}>
      {!compactHeader ? (
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      ) : null}

      <div className="mb-8 rounded-[2rem] border border-border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Search saved titles
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search within this list..."
              className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none lg:w-44"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Sort by
            </label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none lg:w-44"
            >
              <option value="recent">Recently added</option>
              <option value="title">Title</option>
              <option value="media">Media type</option>
            </select>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing {filteredItems.length} of {savedItems.length} saved titles.
        </p>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-sm text-muted-foreground">
          Nothing matches your current filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {filteredItems.map((item) => {
            const href =
              item.media_type === "movie"
                ? `/movie/${item.title_slug}`
                : `/tv/${item.title_slug}`;

            const posterUrl = tmdbPosterUrl(item.poster_url);

            return (
              <div
                key={item.id}
                className="group rounded-3xl border border-border bg-card p-3"
              >
                <Link href={href}>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
                    <TitleQuickActions titleSlug={item.title_slug} />

                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={item.title_name}
                        fill
                        sizes="220px"
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
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

      {savedItems.length > 0 ? (
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
      ) : null}
    </div>
  );
}