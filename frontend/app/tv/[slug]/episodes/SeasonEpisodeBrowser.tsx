"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TVEpisode, TVSeason } from "@/services/tv-episodes";

type SeasonEpisodeBrowserProps = {
  slug: string;
  seasons: TVSeason[];
  selectedSeason: number;
  episodes: TVEpisode[];
};

export function SeasonEpisodeBrowser({
  slug,
  seasons,
  selectedSeason,
  episodes,
}: SeasonEpisodeBrowserProps) {
  const router = useRouter();

  function handleSeasonChange(value: string) {
    router.push(`/tv/${slug}/episodes?season=${value}`);
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm lg:sticky lg:top-20">
        <h2 className="text-sm font-semibold">Seasons</h2>

        {seasons.find((s) => s.season_number === selectedSeason)?.overview && (
          <p className="mt-2 line-clamp-5 text-xs leading-5 text-muted-foreground">
            {seasons.find((s) => s.season_number === selectedSeason)!.overview}
          </p>
        )}

        {/* Desktop list */}
        <div className="mt-4 hidden space-y-2 lg:block">
          {seasons.map((season) => (
            <button
              key={season.id}
              type="button"
              onClick={() => handleSeasonChange(String(season.season_number))}
              className={[
                "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                season.season_number === selectedSeason
                  ? "border-foreground bg-muted text-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/40",
              ].join(" ")}
            >
              <span className="font-medium">
                {season.name || `Season ${season.season_number}`}
              </span>
              <span className="mt-0.5 block text-xs">
                {season.episode_count} episodes
              </span>
            </button>
          ))}
        </div>

        {/* Mobile select */}
        <select
          value={selectedSeason}
          onChange={(e) => handleSeasonChange(e.target.value)}
          className="mt-4 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none lg:hidden"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.season_number}>
              {season.name || `Season ${season.season_number}`}
            </option>
          ))}
        </select>
      </aside>

      <div className="space-y-4">
        {episodes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
            No episodes found for this season.
          </div>
        ) : (
          episodes.map((episode) => (
            <EpisodeCard key={episode.id} slug={slug} episode={episode} />
          ))
        )}
      </div>
    </section>
  );
}

function EpisodeCard({ slug, episode }: { slug: string; episode: TVEpisode }) {
  return (
    <Link
      href={`/tv/${slug}/episodes/${episode.season_number}/${episode.episode_number}`}
      className="block transition"
    >
      <article className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition hover:bg-muted/30">
      <div className="grid sm:grid-cols-[220px_1fr]">
        <div className="aspect-video bg-muted sm:aspect-auto">
          {episode.still_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={episode.still_url}
              alt={episode.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-32 items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                S{episode.season_number} E{episode.episode_number}
              </p>
              <h3 className="mt-1 text-base font-semibold">
                {episode.name || `Episode ${episode.episode_number}`}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {episode.vote_average !== null && (
                <span className="rounded-full border border-border bg-background px-2 py-1">
                  TMDB {episode.vote_average.toFixed(1)}
                </span>
              )}
              {episode.user_rating !== null && (
                <span className="rounded-full border border-border bg-background px-2 py-1">
                  You {episode.user_rating}/10
                </span>
              )}
            </div>
          </div>

          <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
            {episode.overview || "No description available for this episode."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {episode.air_date && (
              <span>{new Date(episode.air_date).toLocaleDateString()}</span>
            )}
            {episode.runtime && <span>{episode.runtime} min</span>}
            {episode.vote_count !== null && episode.vote_count > 0 && (
              <span>{episode.vote_count.toLocaleString()} votes</span>
            )}
          </div>
        </div>
      </div>
      </article>
    </Link>
  );
}
