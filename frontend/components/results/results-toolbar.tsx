"use client";

type Option = {
  label: string;
  value: string;
};

type ResultsToolbarProps = {
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: Option[];
  mediaValue?: string;
  onMediaChange?: (value: string) => void;
  mediaOptions?: Option[];
  minRating?: string;
  onMinRatingChange?: (value: string) => void;
  minVotes?: string;
  onMinVotesChange?: (value: string) => void;
};

export function ResultsToolbar({
  sortValue,
  onSortChange,
  sortOptions,
  mediaValue,
  onMediaChange,
  mediaOptions,
  minRating,
  onMinRatingChange,
  minVotes,
  onMinVotesChange,
}: ResultsToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-[1.5rem] border border-border bg-card p-4 md:flex-row md:flex-wrap md:items-center">
      {mediaOptions && onMediaChange ? (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Media type
          </label>
          <select
            value={mediaValue}
            onChange={(e) => onMediaChange(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none"
          >
            {mediaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Sort by
        </label>
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {onMinRatingChange ? (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Min rating
          </label>
          <select
            value={minRating}
            onChange={(e) => onMinRatingChange(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none"
          >
            <option value="">Any</option>
            <option value="6">6+</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
            <option value="9">9+</option>
          </select>
        </div>
      ) : null}

      {onMinVotesChange ? (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Min votes
          </label>
          <select
            value={minVotes}
            onChange={(e) => onMinVotesChange(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none"
          >
            <option value="">Any</option>
            <option value="100">100+</option>
            <option value="500">500+</option>
            <option value="1000">1000+</option>
            <option value="5000">5000+</option>
          </select>
        </div>
      ) : null}
    </div>
  );
}