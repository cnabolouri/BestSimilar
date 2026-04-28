import { apiGet, apiPatch, apiPost } from "@/lib/api";

export type ProfileUser = {
  display_name: string;
  username: string;
  username_slug: string;
  email: string;
  bio: string;
  avatar_url: string;
  date_joined: string;
};

export type ProfileSummary = {
  watchlist_count: number;
  favorite_titles_count: number;
  favorite_people_count: number;
  favorites_count: number;
  watched_count: number;
  ratings_count: number;
  reviews_count: number;
};

export type InteractionSummary = ProfileSummary;

export type PrivacySettings = {
  show_ratings: boolean;
  show_watchlist: boolean;
  show_favorite_titles: boolean;
  show_favorite_people: boolean;
  show_reviews: boolean;
  show_watch_history: boolean;
};

export type SiteSettings = {
  theme: "system" | "light" | "dark";
  compact_cards: boolean;
  autoplay_trailers: boolean;
  reduce_animations: boolean;
};

export type TastePreferences = {
  preferred_format: "both" | "movies" | "tv";
  content_rating_preference: "any" | "family" | "pg13" | "mature";
  favorite_genres: string[];
  preferred_languages: string[];
  preferred_countries: string[];
  preferred_providers: string[];
  avoided_genres: string[];
};

export type SecurityDetails = {
  username: string;
  email: string;
};

export function getCurrentProfile() {
  return apiGet<ProfileUser>("/auth/profile/");
}

export function updateCurrentProfile(payload: Partial<ProfileUser>) {
  return apiPatch<ProfileUser>("/auth/profile/", payload);
}

export function getProfileSummary() {
  return apiGet<ProfileSummary>("/auth/profile/summary/");
}

export function getInteractionSummary() {
  return apiGet<InteractionSummary>("/interactions/me/summary/");
}

export function getPrivacySettings() {
  return apiGet<PrivacySettings>("/auth/profile/privacy/");
}

export function updatePrivacySettings(payload: Partial<PrivacySettings>) {
  return apiPatch<PrivacySettings>("/auth/profile/privacy/", payload);
}

export function getSiteSettings() {
  return apiGet<SiteSettings>("/auth/profile/site-settings/");
}

export function updateSiteSettings(payload: Partial<SiteSettings>) {
  return apiPatch<SiteSettings>("/auth/profile/site-settings/", payload);
}

export function getTastePreferences() {
  return apiGet<TastePreferences>("/auth/profile/preferences/");
}

export function updateTastePreferences(payload: Partial<TastePreferences>) {
  return apiPatch<TastePreferences>("/auth/profile/preferences/", payload);
}

export function getSecurityDetails() {
  return apiGet<SecurityDetails>("/auth/profile/security/");
}

export function updateSecurityDetails(payload: { username: string; email: string }) {
  return apiPatch<SecurityDetails>("/auth/profile/security/", payload);
}

export function changePassword(payload: {
  current_password: string;
  new_password: string;
}) {
  return apiPost<{ detail: string }>("/auth/profile/change-password/", payload);
}
