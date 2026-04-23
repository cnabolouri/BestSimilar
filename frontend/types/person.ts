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
};