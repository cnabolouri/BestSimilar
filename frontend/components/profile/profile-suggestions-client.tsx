"use client";

import { useEffect, useState } from "react";
import type { SavedTitleItem } from "@/services/interactions";
import { getSimilarTitles } from "@/services/recommendations";
import type { SimilarTitle } from "@/types/title";
import { ProfileSuggestionSlider } from "@/components/profile/profile-suggestion-slider";

export function ProfileSuggestionsClient({
  sourceItems,
  title,
  description,
}: {
  sourceItems: SavedTitleItem[];
  title: string;
  description: string;
}) {
  const [suggestions, setSuggestions] = useState<SimilarTitle[]>([]);
  const [loading, setLoading] = useState(sourceItems.length > 0);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      const seedTitles = sourceItems.slice(0, 3);
      const seen = new Set(sourceItems.map((item) => item.title_slug));
      const results: SimilarTitle[] = [];

      for (const seed of seedTitles) {
        try {
          const similar = await getSimilarTitles(seed.title_slug, 6);

          for (const item of similar) {
            if (!seen.has(item.slug) && !results.some((r) => r.slug === item.slug)) {
              results.push(item);
            }
          }
        } catch {
          // ignore failed seed
        }
      }

      if (active) {
        setSuggestions(results.slice(0, 12));
        setLoading(false);
      }
    }

    if (sourceItems.length > 0) {
      load();
    }

    return () => {
      active = false;
    };
  }, [sourceItems]);

  if (sourceItems.length === 0) return null;

  if (loading) {
    return (
      <section className="mt-12 rounded-[2rem] border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading recommendations...
      </section>
    );
  }

  if (suggestions.length === 0) {
    return (
      <section className="mt-12 rounded-[2rem] border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        No recommendation suggestions found yet.
      </section>
    );
  }

  return (
    <ProfileSuggestionSlider
      title={title}
      description={description}
      items={suggestions}
    />
  );
}