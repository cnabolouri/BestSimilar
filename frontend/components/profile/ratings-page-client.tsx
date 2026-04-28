"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getRatings,
  removeRating,
  type RatedTitleItem,
} from "@/services/interactions";
import { tmdbPosterUrl } from "@/lib/images";

export function RatingsPageClient() {
  const [items, setItems] = useState<RatedTitleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRatings();
        setItems(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleRemove(item: RatedTitleItem) {
    await removeRating(item.title_slug);
    setItems((current) =>
      current.filter((entry) => entry.title_slug !== item.title_slug)
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Your ratings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Movies and shows you rated.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading ratings...</p>
      ) : items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-sm text-muted-foreground">
          You have not rated anything yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => {
            const href =
              item.media_type === "movie"
                ? `/movie/${item.title_slug}`
                : `/tv/${item.title_slug}`;

            const posterUrl = tmdbPosterUrl(item.poster_url);

            return (
              <div key={item.id} className="rounded-3xl border border-border bg-card p-3">
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

                  <p className="mt-2 text-sm font-semibold text-accent">
                    Your rating: {item.rating}/10
                  </p>
                </Link>

                <button
                  onClick={() => handleRemove(item)}
                  className="mt-3 w-full rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-red-400 hover:text-red-400"
                >
                  Remove rating
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}