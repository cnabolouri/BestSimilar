import Image from "next/image";
import Link from "next/link";
import type { SimilarTitle } from "@/types/title";
import { tmdbPosterUrl } from "@/lib/images";
import { TitleQuickActions } from "@/components/actions/title-quick-actions";

export function TitleSimilarGrid({ items }: { items: SimilarTitle[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">More like this</h2>
        <span className="text-xs text-muted-foreground">{items.length} results</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.slice(0, 10).map((item) => (
          <SimilarTitleCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function SimilarTitleCard({ item }: { item: SimilarTitle }) {
  const href = item.media_type === "movie" ? `/movie/${item.slug}` : `/tv/${item.slug}`;
  const posterUrl = tmdbPosterUrl(item.poster_url);
  const genres = item.genres?.slice(0, 3).join(" / ");

  return (
    <Link
      href={href}
      className="simcine-card group relative block rounded-3xl border border-border bg-card p-[var(--simcine-card-padding)] transition-all duration-200 hover:border-accent/60 hover:shadow-md"
    >
      <TitleQuickActions titleSlug={item.slug} />
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-end p-3 text-xs font-semibold text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-[length:var(--simcine-card-title-size)] font-semibold leading-5">
          {item.name}
        </h3>
        {genres ? (
          <p className="mt-1 text-[length:var(--simcine-card-meta-size)] text-muted-foreground">
            {genres}
          </p>
        ) : null}
        {typeof item.similarity_score === "number" ? (
          <p className="mt-3 text-[length:var(--simcine-card-meta-size)] font-medium text-accent">
            Simcine Match {(item.similarity_score * 100).toFixed(1)}%
          </p>
        ) : null}
      </div>
    </Link>
  );
}
