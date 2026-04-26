"use client";

import { useEffect, useState } from "react";
import { browseTitles, type BrowseTitle } from "@/services/titles";
import { BrowseTitleCard } from "@/components/browse/browse-title-card";
import { EmptyState } from "@/components/ui/empty-state";
import { DiscoverResultCardSkeleton } from "@/components/cards/discover-result-card-skeleton";

export function TitleBrowseClient({
  mediaType,
  title,
  description,
}: {
  mediaType: "movie" | "tv";
  title: string;
  description: string;
}) {
  const [ordering, setOrdering] = useState("popularity");
  const [minRating, setMinRating] = useState("");
  const [minVotes, setMinVotes] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<BrowseTitle[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const data = await browseTitles({
        media_type: mediaType,
        ordering,
        min_rating: minRating,
        min_votes: minVotes,
        page,
      });

      setItems(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch {
      setError("Catalog failed to load. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType, ordering, minRating, minVotes, page]);

  function resetPageAndSet<T>(setter: (value: T) => void, value: T) {
    setPage(1);
    setter(value);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          {count.toLocaleString()} titles
        </p>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Sort by
            </label>
            <select
              value={ordering}
              onChange={(e) => resetPageAndSet(setOrdering, e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
            >
              <option value="popularity">Most popular</option>
              <option value="vote_average">Highest rated</option>
              <option value="vote_count">Most voted</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Minimum rating
            </label>
            <select
              value={minRating}
              onChange={(e) => resetPageAndSet(setMinRating, e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
            >
              <option value="">Any rating</option>
              <option value="6">6+</option>
              <option value="7">7+</option>
              <option value="8">8+</option>
              <option value="9">9+</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Minimum votes
            </label>
            <select
              value={minVotes}
              onChange={(e) => resetPageAndSet(setMinVotes, e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
            >
              <option value="">Any votes</option>
              <option value="100">100+</option>
              <option value="500">500+</option>
              <option value="1000">1,000+</option>
              <option value="5000">5,000+</option>
            </select>
          </div>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <DiscoverResultCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <BrowseTitleCard key={item.id} title={item} />
            ))}
          </div>

          <PaginationControls
            page={page}
            hasNext={Boolean(next)}
            hasPrevious={Boolean(previous)}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        </>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No titles found"
            description="Try relaxing your filters or choosing a different sort option."
          />
        </div>
      )}
    </div>
  );
}

function PaginationControls({
  page,
  hasNext,
  hasPrevious,
  onPrevious,
  onNext,
}: {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium disabled:opacity-40"
      >
        Previous
      </button>

      <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
        Page {page}
      </span>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}