"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PublicProfileSectionFiltersProps = {
  showRatingSort?: boolean;
  showHistorySort?: boolean;
};

export function PublicProfileSectionFilters({
  showRatingSort = false,
  showHistorySort = false,
}: PublicProfileSectionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  const currentSearch = searchParams.get("q") ?? "";
  const currentType = searchParams.get("type") ?? "all";
  const currentSort = searchParams.get("sort") ?? "recent";
  const sortOptions = showRatingSort
    ? [
        { value: "recent", label: "Recently rated" },
        { value: "rating_desc", label: "Rating high-low" },
        { value: "rating_asc", label: "Rating low-high" },
        { value: "title", label: "Title A-Z" },
      ]
    : showHistorySort
      ? [
          { value: "recent", label: "Recently watched" },
          { value: "title", label: "Title A-Z" },
        ]
      : [
          { value: "recent", label: "Recently added" },
          { value: "title", label: "Title A-Z" },
        ];

  return (
    <div className="mb-5 grid gap-3 rounded-2xl border border-border bg-background/60 p-4 sm:grid-cols-[1fr_160px_190px]">
      <input
        defaultValue={currentSearch}
        onChange={(event) => updateParam("q", event.target.value)}
        placeholder="Search this section..."
        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
      />
      <select
        value={currentType}
        onChange={(event) => updateParam("type", event.target.value)}
        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
      >
        <option value="all">All types</option>
        <option value="movie">Movies</option>
        <option value="tv">TV shows</option>
      </select>
      <select
        value={currentSort}
        onChange={(event) => updateParam("sort", event.target.value)}
        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
