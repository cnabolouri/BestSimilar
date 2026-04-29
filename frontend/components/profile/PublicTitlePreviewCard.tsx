import Link from "next/link";
import { tmdbPosterUrl } from "@/lib/images";
import { TitleQuickActions } from "@/components/actions/title-quick-actions";

type FlatTitleItem = {
  title?: {
    slug?: string;
    title?: string;
    poster_url?: string;
    media_type?: string;
    release_year?: number | null;
    vote_average?: number | null;
  };
  title_slug?: string;
  title_name?: string;
  poster_url?: string;
  media_type?: string;
  rating?: number;
  review?: string;
};

type PublicTitlePreviewCardProps = {
  item: FlatTitleItem;
  context?: "watchlist" | "favorite" | "rating" | "history";
};

function titleHref(slug: string | undefined, mediaType: string | undefined) {
  if (!slug) return "#";
  if (mediaType === "tv") return `/tv/${slug}`;
  return `/movie/${slug}`;
}

export function PublicTitlePreviewCard({
  item,
  context,
}: PublicTitlePreviewCardProps) {
  const nestedTitle = item.title;
  const slug = nestedTitle?.slug || item.title_slug;
  const name = nestedTitle?.title || item.title_name || "Untitled";
  const mediaType = nestedTitle?.media_type || item.media_type;
  const poster = tmdbPosterUrl(nestedTitle?.poster_url || item.poster_url);
  const rating = typeof item.rating === "number" ? item.rating : null;

  return (
    <div className="simcine-card group relative w-36 shrink-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <Link href={titleHref(slug, mediaType)} className="block">
        <div className="relative aspect-[2/3] bg-muted">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={name}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              {name.slice(0, 2).toUpperCase()}
            </div>
          )}
          {slug && <TitleQuickActions titleSlug={slug} />}
        </div>

        <div className="p-[var(--simcine-card-padding)]">
          <p className="line-clamp-2 text-[length:var(--simcine-card-title-size)] font-medium leading-snug">{name}</p>
          {rating !== null && (
            <p className="mt-1 text-[length:var(--simcine-card-meta-size)] text-muted-foreground">
              ★ {rating.toFixed(1)}
              {context === "rating" ? " your rating" : ""}
            </p>
          )}
          {context === "rating" && item.review ? (
            <p className="mt-1 line-clamp-2 text-[length:var(--simcine-card-meta-size)] text-muted-foreground">
              {item.review}
            </p>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
