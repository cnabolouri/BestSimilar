import { apiGet } from "@/lib/api";
import type { UnifiedSearchResponse } from "@/types/search";

export async function searchAll(
  query: string,
  limit = 8,
  options?: {
    ordering?: string;
    media_type?: string;
  }
) {
  const params = new URLSearchParams();
  params.set("q", query);
  params.set("limit", String(limit));

  if (options?.ordering && options.ordering !== "relevance") {
    params.set("ordering", options.ordering);
  }

  if (options?.media_type && options.media_type !== "all") {
    params.set("media_type", options.media_type);
  }

  return apiGet<UnifiedSearchResponse>(`/search/?${params.toString()}`);
}