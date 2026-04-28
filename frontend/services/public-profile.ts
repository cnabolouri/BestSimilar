const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export class PublicApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function isPublicApiError(error: unknown, status: number): boolean {
  return error instanceof PublicApiError && error.status === status;
}

async function publicApiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new PublicApiError(
      response.status,
      data?.detail ?? `API request failed: ${response.status}`,
    );
  }

  return data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type PublicProfile = {
  display_name: string;
  username: string;
  username_slug: string;
  bio: string;
  avatar_url: string;
  member_since: string;
};

export type PublicProfileSummary = {
  watchlist_count: number | null;
  favorites_count: number | null;
  favorite_titles_count: number | null;
  favorite_people_count: number | null;
  watched_count: number | null;
  ratings_count: number | null;
  reviews_count: number | null;
  visibility: {
    watchlist: boolean;
    favorites: boolean;
    favorite_titles: boolean;
    favorite_people: boolean;
    history: boolean;
    ratings: boolean;
    reviews: boolean;
  };
};

export type PublicTitleMini = {
  slug: string;
  title: string;
  poster_url: string;
  media_type: string;
  release_year: number | null;
  vote_average: number | null;
};

export type PublicPersonMini = {
  slug: string;
  name: string;
  profile_url: string;
  known_for_department: string;
};

export type PublicTitlePreviewItem = {
  id: number;
  title: PublicTitleMini;
  rating?: number;
  review?: string;
  created_at?: string;
  updated_at?: string;
};

export type PublicPersonPreviewItem = {
  id: number;
  person: PublicPersonMini;
  created_at?: string;
};

export type PublicFavoritesResponse = {
  titles: PublicTitlePreviewItem[];
  people: PublicPersonPreviewItem[];
};

export type PublicProfileOverview = {
  profile: PublicProfile;
  visibility: {
    watchlist: boolean;
    favorites: boolean;
    favorite_titles: boolean;
    favorite_people: boolean;
    ratings: boolean;
    reviews: boolean;
    history: boolean;
  };
  stats: {
    watchlist_count: number | null;
    favorites_count: number | null;
    favorite_titles_count: number | null;
    favorite_people_count: number | null;
    ratings_count: number | null;
    reviews_count: number | null;
    watched_count: number | null;
  };
  previews: {
    watchlist: PublicTitlePreviewItem[];
    favorite_titles: PublicTitlePreviewItem[];
    favorite_people: PublicPersonPreviewItem[];
    ratings: PublicTitlePreviewItem[];
    reviews: PublicTitlePreviewItem[];
    history: PublicTitlePreviewItem[];
  };
  insights: {
    top_genres: { name?: string; count: number }[];
    top_years: { year?: number; count: number }[];
    rating_breakdown: { rating?: number; count: number }[];
  };
};

// ─── Overview & profile ───────────────────────────────────────────────────────

export function getPublicProfile(username: string) {
  return publicApiFetch<PublicProfile>(
    `/auth/profiles/${encodeURIComponent(username)}/`,
  );
}

export function getPublicProfileSummary(username: string) {
  return publicApiFetch<PublicProfileSummary>(
    `/auth/profiles/${encodeURIComponent(username)}/summary/`,
  );
}

export function getPublicProfileOverview(username: string) {
  return publicApiFetch<PublicProfileOverview>(
    `/auth/profiles/${encodeURIComponent(username)}/overview/`,
  );
}

export function searchPublicProfiles(query: string) {
  return publicApiFetch<PublicProfile[]>(
    `/auth/profiles/search/?q=${encodeURIComponent(query)}`,
  );
}

// ─── Section pages — served from /interactions/profiles/ ─────────────────────

export function getPublicProfileWatchlist(username: string) {
  return publicApiFetch<PublicTitlePreviewItem[]>(
    `/interactions/profiles/${encodeURIComponent(username)}/watchlist/`,
  );
}

export function getPublicProfileFavorites(username: string) {
  return publicApiFetch<PublicFavoritesResponse>(
    `/interactions/profiles/${encodeURIComponent(username)}/favorites/`,
  );
}

export function getPublicProfileRatings(username: string) {
  return publicApiFetch<PublicTitlePreviewItem[]>(
    `/interactions/profiles/${encodeURIComponent(username)}/ratings/`,
  );
}

export function getPublicProfileHistory(username: string) {
  return publicApiFetch<PublicTitlePreviewItem[]>(
    `/interactions/profiles/${encodeURIComponent(username)}/history/`,
  );
}

export function getPublicProfileReviews(username: string) {
  return publicApiFetch<PublicTitlePreviewItem[]>(
    `/interactions/profiles/${encodeURIComponent(username)}/reviews/`,
  );
}

// ─── Legacy helper (kept for backward compat) ─────────────────────────────────

export async function getPublicInteractionSection<T>(
  username: string,
  section: string,
) {
  try {
    const data = await publicApiFetch<T>(
      `/interactions/profiles/${encodeURIComponent(username)}/${section}/`,
    );
    return { status: "public" as const, data };
  } catch (error) {
    if (isPublicApiError(error, 403)) {
      return { status: "private" as const, data: null };
    }
    throw error;
  }
}
