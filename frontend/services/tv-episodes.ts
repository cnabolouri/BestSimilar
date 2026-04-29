const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

export type TVSeason = {
  id: number;
  tmdb_id: number | null;
  season_number: number;
  name: string;
  overview: string;
  poster_url: string;
  air_date: string | null;
  episode_count: number;
  vote_average: number | null;
};

export type TVEpisode = {
  id: number;
  tmdb_id: number | null;
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  still_url: string;
  air_date: string | null;
  runtime: number | null;
  vote_average: number | null;
  vote_count: number | null;
  user_rating: number | null;
};

export function getTVSeasons(slug: string) {
  return apiFetch<TVSeason[]>(`/catalog/tv/${encodeURIComponent(slug)}/seasons/`);
}

export function getTVEpisodes(slug: string, season: number) {
  return apiFetch<TVEpisode[]>(
    `/catalog/tv/${encodeURIComponent(slug)}/episodes/?season=${season}`,
  );
}

export function getTVEpisodeDetail(
  slug: string,
  seasonNumber: number,
  episodeNumber: number,
) {
  return apiFetch<TVEpisode>(
    `/catalog/tv/${encodeURIComponent(slug)}/episodes/${seasonNumber}/${episodeNumber}/`,
  );
}
