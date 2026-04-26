import Image from "next/image";
import Link from "next/link";
import type { PersonCredit } from "@/types/person";
import { tmdbPosterUrl } from "@/lib/images";

type GroupedCredit = {
  title_id: number;
  title_name: string;
  title_slug: string;
  title_media_type: "movie" | "tv";
  title_poster_url: string;
  title_release_date: string | null;
  title_first_air_date: string | null;
  title_vote_average: number;
  title_vote_count: number;
  title_popularity: number;
  title_runtime_minutes: number | null;
  title_episode_duration_display: string | null;
  title_seasons_count: number | null;
  title_episodes_count: number | null;
  title_genres: string[];
  roles: string[];
  characters: string[];
  jobs: string[];
};

function groupCredits(credits: PersonCredit[]): GroupedCredit[] {
  const map = new Map<number, GroupedCredit>();

  for (const credit of credits) {
    const existing = map.get(credit.title_id);

    if (!existing) {
      map.set(credit.title_id, {
        title_id: credit.title_id,
        title_name: credit.title_name,
        title_slug: credit.title_slug,
        title_media_type: credit.title_media_type,
        title_poster_url: credit.title_poster_url,
        title_release_date: credit.title_release_date,
        title_first_air_date: credit.title_first_air_date,
        title_vote_average: credit.title_vote_average,
        title_vote_count: credit.title_vote_count,
        title_popularity: credit.title_popularity,
        title_runtime_minutes: credit.title_runtime_minutes,
        title_episode_duration_display: credit.title_episode_duration_display,
        title_seasons_count: credit.title_seasons_count,
        title_episodes_count: credit.title_episodes_count,
        title_genres: credit.title_genres ?? [],
        roles: [credit.role_type],
        characters: credit.character_name ? [credit.character_name] : [],
        jobs: credit.job_name ? [credit.job_name] : [],
      });
    } else {
      if (!existing.roles.includes(credit.role_type)) existing.roles.push(credit.role_type);

      if (credit.character_name && !existing.characters.includes(credit.character_name)) {
        existing.characters.push(credit.character_name);
      }

      if (credit.job_name && !existing.jobs.includes(credit.job_name)) {
        existing.jobs.push(credit.job_name);
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const scoreA = a.title_vote_average * Math.log10(Math.max(a.title_vote_count, 1) + 1);
    const scoreB = b.title_vote_average * Math.log10(Math.max(b.title_vote_count, 1) + 1);
    return scoreB - scoreA;
  });
}

function getYear(credit: GroupedCredit) {
  const date =
    credit.title_media_type === "movie"
      ? credit.title_release_date
      : credit.title_first_air_date;

  return date ? date.slice(0, 4) : null;
}

export function PersonGroupedCreditsGrid({ credits }: { credits: PersonCredit[] }) {
  const groupedCredits = groupCredits(credits);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filmography</h2>
        <span className="text-xs text-muted-foreground">{groupedCredits.length} titles</span>
      </div>

      <div className="space-y-4">
        {groupedCredits.map((credit) => {
          const href =
            credit.title_media_type === "movie"
              ? `/movie/${credit.title_slug}`
              : `/tv/${credit.title_slug}`;

          const posterUrl = tmdbPosterUrl(credit.title_poster_url);
          const year = getYear(credit);

          return (
            <Link
              key={credit.title_id}
              href={href}
              className="group block rounded-[2rem] border border-border bg-card p-4 transition hover:border-accent/60 hover:shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-[95px_1fr]">
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={credit.title_name}
                      fill
                      sizes="95px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {year ? <span>{year}</span> : null}
                    {year ? <span>•</span> : null}
                    <span>{credit.title_media_type.toUpperCase()}</span>
                    {credit.title_genres.length > 0 ? (
                      <>
                        <span>•</span>
                        <span>{credit.title_genres.slice(0, 3).join(" • ")}</span>
                      </>
                    ) : null}
                  </div>

                  <h3 className="mt-2 text-base font-semibold tracking-tight transition group-hover:text-accent">
                    {credit.title_name}
                  </h3>

                  {credit.characters.length > 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      As {credit.characters.join(" / ")}
                    </p>
                  ) : null}

                  {credit.jobs.length > 0 ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {credit.jobs.join(" / ")}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span>⭐ {credit.title_vote_average.toFixed(1)}</span>
                    <span>{credit.title_vote_count.toLocaleString()} votes</span>

                    {credit.title_media_type === "movie" && credit.title_runtime_minutes ? (
                      <span>{credit.title_runtime_minutes} min</span>
                    ) : null}

                    {credit.title_media_type === "tv" && credit.title_episode_duration_display ? (
                      <span>{credit.title_episode_duration_display}</span>
                    ) : null}

                    {credit.title_media_type === "tv" && credit.title_seasons_count ? (
                      <span>{credit.title_seasons_count} seasons</span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {credit.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}