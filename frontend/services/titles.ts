import { apiGet } from "@/lib/api";
import type { SimilarTitlesResponse, TitleDetail } from "@/types/title";

import type { PaginatedResponse } from "@/types/api";



export async function getTitleDetail(slug: string) {
  return apiGet<TitleDetail>(`/catalog/titles/${slug}/`);
}

export async function getSimilarTitles(slug: string, limit = 12) {
  return apiGet<SimilarTitlesResponse>(`/recommendations/titles/${slug}/similar/?limit=${limit}`);
}

export type BrowseTitle = {
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
  genres: {
    id: number;
    tmdb_id: number;
    name: string;
    category: string;
  }[];
};


export async function browseTitles(input: {
  media_type?: "movie" | "tv";
  ordering?: string;
  page?: number;
  genre?: string;
  country?: string;
  year?: string;
  language?: string;
  age_rating?: string;
  provider?: string;
  min_rating?: string;
  min_votes?: string;
}) {
  const params = new URLSearchParams();

  if (input.media_type) params.set("media_type", input.media_type);
  if (input.ordering) params.set("ordering", input.ordering);
  if (input.page) params.set("page", String(input.page));
  if (input.genre) params.set("genre", input.genre);
  if (input.country) params.set("country", input.country);
  if (input.year) params.set("year", input.year);
  if (input.language) params.set("language", input.language);
  if (input.age_rating) params.set("age_rating", input.age_rating);
  if (input.provider) params.set("provider", input.provider);
  if (input.min_rating) params.set("min_rating", input.min_rating);
  if (input.min_votes) params.set("min_votes", input.min_votes);

  return apiGet<PaginatedResponse<BrowseTitle>>(
    `/catalog/titles/?${params.toString()}`
  );
}
