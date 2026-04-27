import { apiGet } from "@/lib/api";
import type { SimilarTitle } from "@/types/title";

export type SimilarTitlesResponse = {
  source?: unknown;
  count: number;
  results: SimilarTitle[];
};

export async function getSimilarTitles(titleSlug: string, limit = 8) {
  const data = await apiGet<SimilarTitlesResponse>(
    `/recommendations/titles/${titleSlug}/similar/?limit=${limit}`
  );

  return data.results;
}