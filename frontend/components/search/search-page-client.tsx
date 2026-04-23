"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchAll } from "@/services/search";
import type { UnifiedSearchResponse } from "@/types/search";
import { UnifiedSearchResults } from "@/components/search/unified-search-results";

export function SearchPageClient() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UnifiedSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialQ.trim()) return;

    let isMounted = true;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const response = await searchAll(initialQ.trim(), 12);
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
  }, [initialQ]);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await searchAll(query.trim(), 12);
      setData(response);
      window.history.replaceState({}, "", `/search?q=${encodeURIComponent(query.trim())}`);
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

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      {data ? <UnifiedSearchResults data={data} /> : null}
    </div>
  );
}