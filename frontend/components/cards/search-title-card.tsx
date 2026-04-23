import Image from "next/image";
import Link from "next/link";
import type { SearchTitle } from "@/types/search";
import { tmdbPosterUrl } from "@/lib/images";

export function SearchTitleCard({ item }: { item: SearchTitle }) {
  const href = item.media_type === "movie" ? `/movie/${item.slug}` : `/tv/${item.slug}`;
  const posterUrl = tmdbPosterUrl(item.poster_url);

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-accent"
    >
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {item.media_type === "movie"
            ? item.release_date?.slice(0, 4)
            : item.first_air_date?.slice(0, 4)}{" "}
          · {item.media_type.toUpperCase()}
        </p>
      </div>
    </Link>
  );
}