"use client";

import { useEffect, useState } from "react";
import {
  getFavoriteTitles,
  getWatchHistory,
  getWatchlist,
  type SavedTitleItem,
} from "@/services/interactions";
import { SavedTitlesClient } from "@/components/profile/saved-titles-client";


export function SavedTitlesPageClient({
  title,
  description,
  type,
}: {
  title: string;
  description: string;
  type: "watchlist" | "favorites" | "history";
}) {
  const [items, setItems] = useState<SavedTitleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data =
            type === "watchlist"
                ? await getWatchlist()
                : type === "favorites"
                ? await getFavoriteTitles()
                : await getWatchHistory();
        setItems(data);
      } catch {
        setError("Please sign in to view this page.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [type]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <SavedTitlesClient
      title={title}
      description={description}
      items={items}
      type={type}
    />
  );
}