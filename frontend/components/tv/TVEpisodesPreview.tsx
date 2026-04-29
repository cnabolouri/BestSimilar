import { getTVEpisodes, getTVSeasons } from "@/services/tv-episodes";
import { TVEpisodesPreviewClient } from "./TVEpisodesPreviewClient";

export async function TVEpisodesPreview({ slug }: { slug: string }) {
  try {
    const seasons = await getTVSeasons(slug);
    if (!seasons.length) return null;

    const firstSeason =
      seasons.find((s) => s.season_number > 0)?.season_number ??
      seasons[0].season_number;

    const episodes = await getTVEpisodes(slug, firstSeason);
    if (!episodes.length) return null;

    return (
      <TVEpisodesPreviewClient
        slug={slug}
        seasons={seasons}
        initialSeason={firstSeason}
        initialEpisodes={episodes}
      />
    );
  } catch {
    return null;
  }
}
