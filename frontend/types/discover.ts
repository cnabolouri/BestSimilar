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
  genres: string[];
  similarity_score: number;
  similarity_reasons: string[];
};

export type DiscoverResponse = {
  prompt: string;
  media_type?: "movie" | "tv";
  count: number;
  results: DiscoverResult[];
};