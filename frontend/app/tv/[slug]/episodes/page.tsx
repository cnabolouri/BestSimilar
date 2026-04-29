import Link from "next/link";
import { notFound } from "next/navigation";
import { getTVEpisodes, getTVSeasons } from "@/services/tv-episodes";
import { SeasonEpisodeBrowser } from "./SeasonEpisodeBrowser";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ season?: string }>;
};

export default async function TVEpisodesPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { season } = await searchParams;

  try {
    const seasons = await getTVSeasons(slug);

    if (!seasons.length) {
      return (
        <main className="bg-background text-foreground">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Link
              href={`/tv/${slug}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
            >
              ← Back to show
            </Link>
            <div className="mt-5">
              <h1 className="text-2xl font-bold tracking-tight">Episodes</h1>
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
              No episode data has been imported for this title yet.
            </div>
          </div>
        </main>
      );
    }

    const firstSeason =
      seasons.find((s) => s.season_number > 0)?.season_number ??
      seasons[0].season_number;

    const selectedSeason = season ? Number(season) : firstSeason;
    const episodes = await getTVEpisodes(slug, selectedSeason);

    return (
      <main className="bg-background text-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href={`/tv/${slug}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Back to show
          </Link>

          <div className="mt-5">
            <h1 className="text-2xl font-bold tracking-tight">Episodes</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse episodes by season.
            </p>
          </div>

          <SeasonEpisodeBrowser
            slug={slug}
            seasons={seasons}
            selectedSeason={selectedSeason}
            episodes={episodes}
          />
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
