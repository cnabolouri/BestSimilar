import Image from "next/image";
import type { TitleDetail } from "@/types/title";
import { tmdbPosterUrl, tmdbBackdropUrl } from "@/lib/images";

export function TitleHero({ title }: { title: TitleDetail }) {
  const year =
    title.media_type === "movie"
      ? title.release_date?.slice(0, 4)
      : title.first_air_date?.slice(0, 4);

  const posterUrl = tmdbPosterUrl(title.poster_url);
  const backdropUrl = tmdbBackdropUrl(title.backdrop_url);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      {backdropUrl ? (
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={title.name}
            fill
            sizes="100vw"
            className="object-cover opacity-10"
          />
        </div>
      ) : null}

      <div className="relative p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-3xl border border-border bg-background">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={title.name}
                fill
                sizes="220px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-end p-4 text-xs font-semibold text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {year ? <span>{year}</span> : null}
              <span>•</span>
              <span>{title.media_type.toUpperCase()}</span>
              {title.genres.length > 0 ? (
                <>
                  <span>•</span>
                  <span>{title.genres.slice(0, 3).map((genre) => genre.name).join(" • ")}</span>
                </>
              ) : null}
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title.name}</h1>

            {title.tagline ? (
              <p className="mt-3 text-sm italic text-muted-foreground">{title.tagline}</p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>⭐ {title.vote_average}</span>
              <span>{title.vote_count} votes</span>
              {title.runtime_minutes ? <span>{title.runtime_minutes} min</span> : null}
              {title.seasons_count ? <span>{title.seasons_count} seasons</span> : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground">
                Add to watchlist
              </button>
              <button className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground">
                Add to favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}