import { apiGet } from "@/lib/api";
import type { UnifiedSearchResponse } from "@/types/search";

export async function searchAll(query: string, limit = 8) {
  const encoded = encodeURIComponent(query);
  return apiGet<UnifiedSearchResponse>(`/search/?q=${encoded}&limit=${limit}`);
}