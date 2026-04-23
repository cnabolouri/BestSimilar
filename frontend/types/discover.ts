export type DiscoverResult = {
  id: number;
  tmdb_id: number;
  slug: string;
  name: string;
  original_name: string;
  media_type: "movie" | "tv";
  poster_url: string;
  backdrop_url: string;
  release_date: string | null;
  first_air_date: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  overview: string;
  runtime_minutes?: number | null;
  seasons_count?: number | null;
  episodes_count?: number | null;
  genres: string[];
  cast_preview: string[];
  similarity_score: number;
  similarity_reasons: string[];
  match_explanation: string;
  episode_run_times?: number[];
  episode_duration_display?: string | null;
};

export type DiscoverResponse = {
  prompt: string;
  media_type?: "movie" | "tv";
  count: number;
  results: DiscoverResult[];
};