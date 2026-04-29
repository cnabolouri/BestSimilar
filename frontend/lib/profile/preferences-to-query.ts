import type { TastePreferences } from "@/services/profile";

export function preferencesToDiscoverDefaults(preferences: TastePreferences) {
  const params = new URLSearchParams();

  if (preferences.preferred_format === "movies") {
    params.set("type", "movie");
    params.set("media_type", "movie");
  }

  if (preferences.preferred_format === "tv") {
    params.set("type", "tv");
    params.set("media_type", "tv");
  }

  if (preferences.favorite_genres.length > 0) {
    params.set("genres", preferences.favorite_genres.join(","));
  }

  if (preferences.preferred_providers.length > 0) {
    params.set("providers", preferences.preferred_providers.join(","));
  }

  return params;
}
