import { apiDelete, apiGet, apiPost } from "@/lib/api";

export type SavedTitleItem = {
  id: number;
  title_name: string;
  title_slug: string;
  media_type: "movie" | "tv";
  poster_url: string;
  created_at: string;
};

export async function getWatchlist() {
  return apiGet<SavedTitleItem[]>("/interactions/watchlist/");
}

export async function addToWatchlist(titleSlug: string) {
  return apiPost<SavedTitleItem>("/interactions/watchlist/", {
    title_slug: titleSlug,
  });
}

export async function removeFromWatchlist(titleSlug: string) {
  return apiDelete<void>(`/interactions/watchlist/${titleSlug}/`);
}

export async function getFavoriteTitles() {
  return apiGet<SavedTitleItem[]>("/interactions/favorites/titles/");
}

export async function addFavoriteTitle(titleSlug: string) {
  return apiPost<SavedTitleItem>("/interactions/favorites/titles/", {
    title_slug: titleSlug,
  });
}

export async function removeFavoriteTitle(titleSlug: string) {
  return apiDelete<void>(`/interactions/favorites/titles/${titleSlug}/`);
}

export type TitleInteractionStatus = {
  in_watchlist: boolean;
  is_favorite: boolean;
  is_watched: boolean;
};

export async function getWatchHistory() {
  return apiGet<SavedTitleItem[]>("/interactions/history/");
}

export async function addWatchedTitle(titleSlug: string) {
  return apiPost<SavedTitleItem>("/interactions/history/", {
    title_slug: titleSlug,
  });
}

export async function removeWatchedTitle(titleSlug: string) {
  return apiDelete<void>(`/interactions/history/${titleSlug}/`);
}

export async function getTitleInteractionStatus(titleSlug: string) {
  return apiGet<TitleInteractionStatus>(
    `/interactions/titles/${titleSlug}/status/`
  );
}

export type FavoritePersonItem = {
  id: number;
  person_name: string;
  person_slug: string;
  known_for_department: string;
  profile_url: string;
  created_at: string;
};

export async function getFavoritePeople() {
  return apiGet<FavoritePersonItem[]>("/interactions/favorites/people/");
}

export async function addFavoritePerson(personSlug: string) {
  return apiPost<FavoritePersonItem>("/interactions/favorites/people/", {
    person_slug: personSlug,
  });
}

export async function removeFavoritePerson(personSlug: string) {
  return apiDelete<void>(`/interactions/favorites/people/${personSlug}/`);
}