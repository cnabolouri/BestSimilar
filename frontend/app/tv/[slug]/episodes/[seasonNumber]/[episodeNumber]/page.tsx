import Link from "next/link";
import { notFound } from "next/navigation";
import { getTVEpisodeDetail } from "@/services/tv-episodes";

type PageProps = {
  params: Promise<{
    slug: string;
    seasonNumber: string;
    episodeNumber: string;
  }>;
};

export default async function TVEpisodeDetailPage({ params }: PageProps) {
  const { slug, seasonNumber, episodeNumber } = await params;
  const season = Number(seasonNumber);
  const episodeNo = Number(episodeNumber);

  try {
    const episode = await getTVEpisodeDetail(slug, season, episodeNo);

    return (
      <main className="bg-background text-foreground">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href={`/tv/${slug}/episodes?season=${season}`}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Back to Season {season}
          </Link>

          <article className="mt-5 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="aspect-video bg-muted">
              {episode.still_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={episode.still_url}
                  alt={episode.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No episode image
                </div>
              )}
            </div>

            <div className="p-5">
              <p className="text-sm font-medium text-muted-foreground">
                Season {episode.season_number}, Episode {episode.episode_number}
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {episode.name || `Episode ${episode.episode_number}`}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {episode.air_date && (
                  <span className="rounded-full border border-border bg-background px-3 py-1">
                    {new Date(episode.air_date).toLocaleDateString()}
                  </span>
                )}
                {episode.runtime && (
                  <span className="rounded-full border border-border bg-background px-3 py-1">
                    {episode.runtime} min
                  </span>
                )}
                {episode.vote_average !== null && (
                  <span className="rounded-full border border-border bg-background px-3 py-1">
                    TMDB {episode.vote_average.toFixed(1)}
                  </span>
                )}
                {episode.user_rating !== null && (
                  <span className="rounded-full border border-border bg-background px-3 py-1">
                    You {episode.user_rating}/10
                  </span>
                )}
              </div>

              <section className="mt-6">
                <h2 className="text-lg font-semibold">Story</h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  {episode.overview || "No story available for this episode."}
                </p>
              </section>

              <section className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-5">
                <h2 className="text-base font-semibold">More Episode Details</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Episode cast, reviews, and rating controls will be added here.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
