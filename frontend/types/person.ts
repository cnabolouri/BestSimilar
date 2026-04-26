export type PersonCredit = {
  id: number;
  role_type: string;
  character_name: string;
  job_name: string;
  billing_order: number | null;

  title_id: number;
  title_name: string;
  title_slug: string;
  title_media_type: "movie" | "tv";
  title_poster_url: string;
  title_release_date: string | null;
  title_first_air_date: string | null;
  title_vote_average: number;
  title_vote_count: number;
  title_popularity: number;
  title_runtime_minutes: number | null;
  title_episode_duration_display: string | null;
  title_seasons_count: number | null;
  title_episodes_count: number | null;
  title_genres: string[];
};

export type PersonDetail = {
  id: number;
  tmdb_id: number;
  slug: string;
  name: string;
  known_for_department: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string;
  profile_url: string;
  popularity: number;
  credits: PersonCredit[];
  created_at: string;
  updated_at: string;
  news_items: PersonNewsItem[];
};

export type PersonNewsItem = {
  source_name: string;
  headline: string;
  summary: string;
  url: string;
  published_at: string | null;
};

export type RelatedPerson = {
  id: number;
  tmdb_id: number;
  slug: string;
  name: string;
  known_for_department: string;
  profile_url: string;
  popularity: number;
  shared_titles_count: number;
};