"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { discoverTitles } from "@/services/discover";
import type { DiscoverResponse } from "@/types/discover";
import { DiscoverResultsGrid } from "@/components/discover/discover-results-grid";
import { DiscoverResultCardSkeleton } from "@/components/cards/discover-result-card-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

import { ResultsToolbar } from "@/components/results/results-toolbar";

export function DiscoverPageClient() {
  const params = useSearchParams();

  const initialPrompt = params.get("prompt") ?? "";
  const initialMediaType =
    params.get("media_type") === "movie" ? "movie" : "tv";

  const [prompt, setPrompt] = useState(initialPrompt);
  const [mediaType, setMediaType] = useState<"movie" | "tv">(initialMediaType);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiscoverResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("score");
  const [minRating, setMinRating] = useState("");
  const [minVotes, setMinVotes] = useState("");

  const filteredResults = data
    ? [...data.results]
        .filter((result) => {
          if (minRating && Number(result.vote_average) < Number(minRating)) {
            return false;
          }
          if (minVotes && Number(result.vote_count) < Number(minVotes)) {
            return false;
          }
          return true;
        })
        .sort((a, b) => {
          if (sortBy === "newest") {
            return (
              Number(new Date(b.release_date || b.first_air_date || "")) -
              Number(new Date(a.release_date || a.first_air_date || ""))
            );
          }

          const aValue = Number((a as any)[sortBy] ?? 0);
          const bValue = Number((b as any)[sortBy] ?? 0);

          return bValue - aValue;
        })
    : [];

  useEffect(() => {
    if (!initialPrompt.trim()) return;

    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const response = await discoverTitles({
          prompt: initialPrompt.trim(),
          media_type: initialMediaType,
          limit: 12,
        });
        if (mounted) setData(response);
      } catch {
        if (mounted) setError("Discovery failed. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [initialPrompt, initialMediaType]);

  async function handleDiscover() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await discoverTitles({
        prompt: prompt.trim(),
        media_type: mediaType,
        limit: 12,
      });
      setData(response);

      const search = new URLSearchParams({
        prompt: prompt.trim(),
        media_type: mediaType,
      });

      window.history.replaceState({}, "", `/discover?${search.toString()}`);
    } catch {
      setError("Discovery failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Discover</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Describe a tone, mood, theme, or type of story and Simcine will surface semantically similar titles.
        </p>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='A workplace comedy like "The Office", but more emotional and family-focused...'
          className="min-h-[140px] w-full resize-none rounded-2xl border border-transparent bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex rounded-full border border-border bg-background p-1">
            {(["tv", "movie"] as const).map((value) => {
              const active = mediaType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMediaType(value)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {value === "tv" ? "TV Shows" : "Movies"}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleDiscover}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Discovering..." : "Discover"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <ResultsToolbar
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { label: "Simcine score", value: "score" },
            { label: "Rating", value: "vote_average" },
            { label: "Vote count", value: "vote_count" },
            { label: "Popularity", value: "popularity" },
            { label: "Newest", value: "newest" },
          ]}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          minVotes={minVotes}
          onMinVotesChange={setMinVotes}
        />
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8">
          <div className="mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Results
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <DiscoverResultCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : null}

      {!loading && data ? (
        filteredResults.length > 0 ? (
          <DiscoverResultsGrid
            data={{
              ...data,
              count: filteredResults.length,
              results: filteredResults,
            }}
          />
        ) : (
          <div className="mt-8">
            <EmptyState
              title="No close matches found"
              description="Try relaxing the filters or describing genre, tone, pacing, setting, or emotional feel."
            />
          </div>
        )
      ) : null}
    </div>
  );
}