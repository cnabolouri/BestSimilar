import { apiGet } from "@/lib/api";
import type { SimilarTitlesResponse, TitleDetail } from "@/types/title";

export async function getTitleDetail(slug: string) {
  return apiGet<TitleDetail>(`/catalog/titles/${slug}/`);
}

export async function getSimilarTitles(slug: string, limit = 12) {
  return apiGet<SimilarTitlesResponse>(`/recommendations/titles/${slug}/similar/?limit=${limit}`);
}