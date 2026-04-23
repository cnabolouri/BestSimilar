import type { TitleDetail } from "@/types/title";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return value;
}

export function TitleFactsGrid({ title }: { title: TitleDetail }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <FactCard label="Media type" value={title.media_type.toUpperCase()} />
      <FactCard
        label={title.media_type === "movie" ? "Release date" : "First air date"}
        value={
          title.media_type === "movie"
            ? formatDate(title.release_date)
            : formatDate(title.first_air_date)
        }
      />
      {title.media_type === "tv" ? (
        <FactCard label="Last air date" value={formatDate(title.last_air_date)} />
      ) : null}
      {typeof title.runtime_minutes === "number" && title.runtime_minutes > 0 ? (
        <FactCard label="Runtime" value={`${title.runtime_minutes} min`} />
      ) : null}
      {typeof title.seasons_count === "number" && title.seasons_count > 0 ? (
        <FactCard label="Seasons" value={String(title.seasons_count)} />
      ) : null}
      {typeof title.episodes_count === "number" && title.episodes_count > 0 ? (
        <FactCard label="Episodes" value={String(title.episodes_count)} />
      ) : null}
      <FactCard label="Language" value={title.original_language || "—"} />
      <FactCard label="Status" value={title.status || "—"} />
      <FactCard label="TMDB rating" value={`${title.vote_average} / 10`} />
      <FactCard label="Votes" value={title.vote_count.toLocaleString()} />
    </div>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}