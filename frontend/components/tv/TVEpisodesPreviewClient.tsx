"use client";

import Link from "next/link";
import { useState } from "react";
import { getTVEpisodes, type TVEpisode, type TVSeason } from "@/services/tv-episodes";

type TVEpisodesPreviewClientProps = {
  slug: string;
  seasons: TVSeason[];
  initialSeason: number;
  initialEpisodes: TVEpisode[];
};

export function TVEpisodesPreviewClient({
  slug,
  seasons,
  initialSeason,
  initialEpisodes,
}: TVEpisodesPreviewClientProps) {
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [episodes, setEpisodes] = useState<TVEpisode[]>(initialEpisodes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSeasonChange(value: string) {
    const next = Number(value);
    setSelectedSeason(next);
    setLoading(true);
    setError(null);
    try {
      setEpisodes(await getTVEpisodes(slug, next));
    } catch {
      setError("Could not load episodes for this season.");
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  }

  const seasonMeta = seasons.find((s) => s.season_number === selectedSeason);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Episodes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse episodes by season.
          </p>
          {seasonMeta?.episode_count ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {seasonMeta.episode_count} episodes in{" "}
              {seasonMeta.name || `Season ${selectedSeason}`}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.season_number}>
                {season.name || `Season ${season.season_number}`}
              </option>
            ))}
          </select>

          <Link
            href={`/tv/${slug}/episodes?season=${selectedSeason}`}
            className="rounded-xl border border-border bg-background px-3 py-2 text-center text-sm font-medium transition hover:bg-muted"
          >
            View full page
          </Link>
        </div>
      </div>

      {seasonMeta?.overview && (
        <p className="mb-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {seasonMeta.overview}
        </p>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          Loading episodes...
        </div>
      ) : episodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          No episodes found for this season.
        </div>
      ) : (
        <div className="max-h-[740px] overflow-y-auto pr-1 [scrollbar-width:thin]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((episode) => (
              <EpisodePreviewCard key={episode.id} slug={slug} episode={episode} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function EpisodePreviewCard({
  slug,
  episode,
}: {
  slug: string;
  episode: TVEpisode;
}) {
  return (
    <Link
      href={`/tv/${slug}/episodes/${episode.season_number}/${episode.episode_number}`}
      className="group overflow-hidden rounded-xl border border-border bg-background transition hover:bg-muted/40"
    >
      <div className="aspect-video bg-muted">
        {episode.still_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={episode.still_url}
            alt={episode.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">
              S{episode.season_number} · E{episode.episode_number}
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-medium">
              {episode.name || `Episode ${episode.episode_number}`}
            </h3>
          </div>
          {episode.vote_average !== null && (
            <span className="shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
              {episode.vote_average.toFixed(1)}
            </span>
          )}
        </div>

        {episode.overview ? (
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
            {episode.overview}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">No story available.</p>
        )}

        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {episode.air_date && (
            <span>{new Date(episode.air_date).toLocaleDateString()}</span>
          )}
          {episode.runtime && <span>{episode.runtime} min</span>}
          {episode.user_rating !== null && (
            <span>You {episode.user_rating}/10</span>
          )}
        </div>
      </div>
    </Link>
  );
}
