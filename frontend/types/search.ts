export type SearchTitle = {
  result_type: "title";
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
};

export type SearchPerson = {
  result_type: "person";
  id: number;
  tmdb_id: number;
  slug: string;
  name: string;
  known_for_department: string;
  profile_url: string;
  popularity: number;
};

export type UnifiedSearchResponse = {
  query: string;
  titles_count: number;
  people_count: number;
  titles: SearchTitle[];
  people: SearchPerson[];
};