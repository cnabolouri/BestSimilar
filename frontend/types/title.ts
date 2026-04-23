export type TitleGenre = {
  id: number;
  tmdb_id: number;
  name: string;
  category: string;
};

export type TitleKeyword = {
  id: number;
  tmdb_id: number;
  name: string;
};

export type TitleTheme = {
  id: number;
  name: string;
  type: string;
};

export type TitleCredit = {
  id: number;
  role_type: string;
  character_name: string;
  job_name: string;
  billing_order: number | null;
  person_id: number;
  person_name: string;
  person_slug: string;
  person_profile_url: string;
};

export type TitleDetail = {
  id: number;
  tmdb_id: number;
  slug: string;
  name: string;
  original_name: string;
  media_type: "movie" | "tv";
  status: string;
  overview: string;
  tagline: string;
  original_language: string;
  country_codes: string[];
  poster_url: string;
  backdrop_url: string;
  release_date: string | null;
  first_air_date: string | null;
  last_air_date: string | null;
  runtime_minutes: number | null;
  episode_run_times: number[];
  seasons_count: number | null;
  episodes_count: number | null;
  age_rating: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  is_adult: boolean;
  genres: TitleGenre[];
  keywords: TitleKeyword[];
  themes: TitleTheme[];
  credits: TitleCredit[];
  created_at: string;
  updated_at: string;
};

export type SimilarTitle = {
  id: number;
  tmdb_id: number;
  slug: string;
  name: string;
  original_name: string;
  media_type: "movie" | "tv";
  poster_url: string;
};

export type SimilarTitlesResponse = {
  results: SimilarTitle[];
};