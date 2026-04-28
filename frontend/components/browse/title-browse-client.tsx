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
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [provider, setProvider] = useState("");
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
        genre,
        country,
        year,
        language,
        age_rating: ageRating,
        provider,
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
  }, [
    mediaType,
    ordering,
    minRating,
    minVotes,
    genre,
    country,
    year,
    language,
    ageRating,
    provider,
    page,
  ]);

  function resetPageAndSet<T>(setter: (value: T) => void, value: T) {
    setPage(1);
    setter(value);
  }

  const ageRatingOptions: [string, string][] =
    mediaType === "movie"
      ? [
          ["", "Any rating"],
          ["G", "G"],
          ["PG", "PG"],
          ["PG-13", "PG-13"],
          ["R", "R"],
          ["NC-17", "NC-17"],
        ]
      : [
          ["", "Any rating"],
          ["TV-Y", "TV-Y"],
          ["TV-Y7", "TV-Y7"],
          ["TV-G", "TV-G"],
          ["TV-PG", "TV-PG"],
          ["TV-14", "TV-14"],
          ["TV-MA", "TV-MA"],
        ];

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
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label="Sort by"
            value={ordering}
            onChange={(value) => resetPageAndSet(setOrdering, value)}
            options={[
              ["popularity", "Most popular"],
              ["vote_average", "Highest rated"],
              ["vote_count", "Most voted"],
              ["newest", "Newest"],
              ["oldest", "Oldest"],
            ]}
          />

          <FilterSelect
            label="Genre"
            value={genre}
            onChange={(value) => resetPageAndSet(setGenre, value)}
            options={[
              ["", "Any genre"],
              ["Action", "Action"],
              ["Adventure", "Adventure"],
              ["Animation", "Animation"],
              ["Comedy", "Comedy"],
              ["Crime", "Crime"],
              ["Documentary", "Documentary"],
              ["Drama", "Drama"],
              ["Family", "Family"],
              ["Fantasy", "Fantasy"],
              ["Horror", "Horror"],
              ["Mystery", "Mystery"],
              ["Romance", "Romance"],
              ["Science Fiction", "Science Fiction"],
              ["Sci-Fi & Fantasy", "Sci-Fi & Fantasy"],
              ["Thriller", "Thriller"],
              ["War", "War"],
              ["Western", "Western"],
            ]}
          />

          <FilterSelect
            label="Minimum rating"
            value={minRating}
            onChange={(value) => resetPageAndSet(setMinRating, value)}
            options={[
              ["", "Any rating"],
              ["6", "6+"],
              ["7", "7+"],
              ["8", "8+"],
              ["9", "9+"],
            ]}
          />

          <FilterSelect
            label="Minimum votes"
            value={minVotes}
            onChange={(value) => resetPageAndSet(setMinVotes, value)}
            options={[
              ["", "Any votes"],
              ["100", "100+"],
              ["500", "500+"],
              ["1000", "1,000+"],
              ["5000", "5,000+"],
            ]}
          />

          <FilterInput
            label="Year"
            value={year}
            onChange={(value) => resetPageAndSet(setYear, value)}
            placeholder="year"
          />

          <FilterSelect
            label="Country"
            value={country}
            onChange={(value) => resetPageAndSet(setCountry, value)}
            options={[
              ["", "Any country"],
              ["US", "United States"],
              ["GB", "United Kingdom"],
              ["CA", "Canada"],
              ["KR", "South Korea"],
              ["JP", "Japan"],
              ["FR", "France"],
              ["DE", "Germany"],
              ["IN", "India"],
            ]}
          />

          <FilterSelect
            label="Language"
            value={language}
            onChange={(value) => resetPageAndSet(setLanguage, value)}
            options={[
              ["", "Any language"],
              ["en", "English"],
              ["es", "Spanish"],
              ["fr", "French"],
              ["de", "German"],
              ["ja", "Japanese"],
              ["ko", "Korean"],
              ["hi", "Hindi"],
            ]}
          />

          <FilterSelect
            label="Age rating"
            value={ageRating}
            onChange={(value) => resetPageAndSet(setAgeRating, value)}
            options={ageRatingOptions}
          />

          <FilterSelect
            label="Streaming service"
            value={provider}
            onChange={(value) => resetPageAndSet(setProvider, value)}
            options={[
              ["", "Any provider"],
              ["Netflix", "Netflix"],
              ["Hulu", "Hulu"],
              ["Amazon", "Amazon"],
              ["Prime Video", "Prime Video"],
              ["Disney", "Disney+"],
              ["HBO", "HBO Max"],
              ["Max", "Max"],
              ["Apple", "Apple TV"],
              ["Paramount", "Paramount+"],
              ["Peacock", "Peacock"],
            ]}
          />

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setOrdering("popularity");
                setMinRating("");
                setMinVotes("");
                setGenre("");
                setCountry("");
                setYear("");
                setLanguage("");
                setAgeRating("");
                setProvider("");
              }}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold text-muted-foreground transition hover:border-accent/60 hover:text-foreground"
            >
              Clear filters
            </button>
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
      />
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
