"use client";

import { useEffect, useState } from "react";
import { browsePeople } from "@/services/people";
import type { SearchPerson } from "@/types/search";
import { SearchPersonCard } from "@/components/cards/search-person-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchPersonCardSkeleton } from "@/components/cards/search-person-card-skeleton";

export function PeopleBrowseClient() {
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState<SearchPerson[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const data = await browsePeople({
        department,
        page,
      });

      setPeople(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch {
      setError("People failed to load. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, page]);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">People</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse actors, directors, writers, and creators.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {count.toLocaleString()} people
        </p>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-4">
        <div className="max-w-sm">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => {
              setPage(1);
              setDepartment(e.target.value);
            }}
            className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
          >
            <option value="">All departments</option>
            <option value="Acting">Acting</option>
            <option value="Directing">Directing</option>
            <option value="Writing">Writing</option>
            <option value="Production">Production</option>
          </select>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      {loading ? (
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <SearchPersonCardSkeleton key={i} />
          ))}
        </div>
      ) : people.length > 0 ? (
        <>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <SearchPersonCard key={person.id} item={person} />
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
            title="No people found"
            description="Try another department filter."
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