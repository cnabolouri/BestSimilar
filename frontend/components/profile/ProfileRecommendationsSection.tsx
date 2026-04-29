import Link from "next/link";
import { PublicTitlePreviewCard } from "@/components/profile/PublicTitlePreviewCard";
import { getPersonalizedRecommendations } from "@/services/recommendations";

export async function ProfileRecommendationsSection() {
  let items: Awaited<
    ReturnType<typeof getPersonalizedRecommendations>
  >["results"] = [];
  let topGenres: string[] = [];

  try {
    const response = await getPersonalizedRecommendations();
    items = response.results;
    topGenres = response.meta?.top_genres ?? [];
  } catch {
    // Not logged in or endpoint unavailable — show empty state.
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recommended For You</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on your ratings, favorites, watchlist, history, and
            preferences.
          </p>

          {topGenres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {topGenres.slice(0, 5).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/discover?personalized=true"
          className="shrink-0 text-sm text-muted-foreground transition hover:text-foreground"
        >
          View more
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          Start rating or saving titles to unlock better recommendations.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {items.slice(0, 12).map((item) => (
            <PublicTitlePreviewCard
              key={item.slug}
              item={{
                title_slug: item.slug,
                title_name: item.name,
                poster_url: item.poster_url ?? undefined,
                media_type: item.media_type,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
