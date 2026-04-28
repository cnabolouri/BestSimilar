const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function publicApiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

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

export type PublicFavoritesResponse = {
  titles: unknown[];
  people: unknown[];
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
    watchlist: unknown[];
    favorite_titles: unknown[];
    favorite_people: unknown[];
    ratings: unknown[];
    reviews: unknown[];
    history: unknown[];
  };
  insights: {
    top_genres: unknown[];
    top_years: unknown[];
    rating_breakdown: unknown[];
  };
};

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

export async function getPublicInteractionSection<T>(
  username: string,
  section: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/interactions/profiles/${encodeURIComponent(username)}/${section}/`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 403) {
    return { status: "private" as const, data: null };
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return { status: "public" as const, data: (await response.json()) as T };
}
