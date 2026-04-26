import Image from "next/image";
import Link from "next/link";
import type { BrowseTitle } from "@/services/titles";
import { tmdbPosterUrl } from "@/lib/images";

export function BrowseTitleCard({ title }: { title: BrowseTitle }) {
  const href = title.media_type === "movie" ? `/movie/${title.slug}` : `/tv/${title.slug}`;
  const posterUrl = tmdbPosterUrl(title.poster_url);

  const year =
    title.media_type === "movie"
      ? title.release_date?.slice(0, 4)
      : title.first_air_date?.slice(0, 4);

  return (
    <Link
      href={href}
      className="group rounded-3xl border border-border bg-card p-3 transition hover:border-accent/60 hover:shadow-sm"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title.name}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-accent">
          {title.name}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          {year ? `${year} • ` : ""}
          {title.media_type.toUpperCase()}
        </p>

        {title.genres.length > 0 ? (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {title.genres.slice(0, 3).map((genre) => genre.name).join(" • ")}
          </p>
        ) : null}

        <p className="mt-2 text-xs text-muted-foreground">
          ⭐ {title.vote_average.toFixed(1)} · {title.vote_count.toLocaleString()} votes
        </p>
      </div>
    </Link>
  );
}