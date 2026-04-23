import { apiPost } from "@/lib/api";
import type { DiscoverResponse } from "@/types/discover";

export async function discoverTitles(input: {
  prompt: string;
  media_type?: "movie" | "tv";
  limit?: number;
}) {
  return apiPost<DiscoverResponse>("/ai/discover/", input);
}