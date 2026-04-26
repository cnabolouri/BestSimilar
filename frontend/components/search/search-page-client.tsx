"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchAll } from "@/services/search";
import type { UnifiedSearchResponse } from "@/types/search";
import { UnifiedSearchResults } from "@/components/search/unified-search-results";
import { SearchTitleCardSkeleton } from "@/components/cards/search-title-card-skeleton";
import { SearchPersonCardSkeleton } from "@/components/cards/search-person-card-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ResultsToolbar } from "@/components/results/results-toolbar";

export function SearchPageClient() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const initialType = params.get("type") ?? "all";

  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UnifiedSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState("relevance");
  const [mediaType, setMediaType] = useState("all");
  const [searchType, setSearchType] = useState(initialType);

  useEffect(() => {
    if (!initialQ.trim()) return;

    let isMounted = true;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const response = await searchAll(initialQ.trim(), 12, {
          ordering: sortBy,
          media_type: mediaType,
        });
        if (isMounted) setData(response);
      } catch {
        if (isMounted) setError("Search failed. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    run();

    return () => {
      isMounted = false;
    };
  }, [initialQ, sortBy, mediaType]);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await searchAll(query.trim(), 12, {
        ordering: sortBy,
        media_type: mediaType,
      });
      setData(response);

      const qs = new URLSearchParams();
      qs.set("q", query.trim());
      if (sortBy !== "relevance") qs.set("sort", sortBy);
      if (mediaType !== "all") qs.set("media_type", mediaType);
      if (searchType !== "all") qs.set("type", searchType);

      window.history.replaceState({}, "", `/search?${qs.toString()}`);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search titles and people across the Simcine catalog.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-[2rem] border border-border bg-card p-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows, or people..."
          className="h-14 w-full rounded-2xl border border-transparent bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-5 inline-flex rounded-full border border-border bg-card p-1">
        {[
          { label: "All", value: "all" },
          { label: "Titles", value: "titles" },
          { label: "People", value: "people" },
        ].map((item) => {
          const active = searchType === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setSearchType(item.value)}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <ResultsToolbar
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { label: "Relevance", value: "relevance" },
            { label: "Rating", value: "vote_average" },
            { label: "Vote count", value: "vote_count" },
            { label: "Popularity", value: "popularity" },
            { label: "Newest", value: "newest" },
          ]}
          mediaValue={mediaType}
          onMediaChange={setMediaType}
          mediaOptions={[
            { label: "All", value: "all" },
            { label: "Movies", value: "movie" },
            { label: "TV Shows", value: "tv" },
          ]}
        />
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      {loading ? (
        <div className="mt-8 space-y-10">
          <section>
            <div className="mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Titles
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SearchTitleCardSkeleton key={i} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                People
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SearchPersonCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {!loading && data ? (
        data.titles.length === 0 && data.people.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No matches found"
              description={`We couldn’t find results for “${data.query}”. Try a broader search.`}
            />
          </div>
        ) : (
          <UnifiedSearchResults data={data} searchType={searchType} />
        )
      ) : null}
    </div>
  );
}