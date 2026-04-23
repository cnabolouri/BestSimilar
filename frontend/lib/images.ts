const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w780";
const TMDB_PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

export function tmdbPosterUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${TMDB_POSTER_BASE}${path}`;
}

export function tmdbBackdropUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${TMDB_BACKDROP_BASE}${path}`;
}

export function tmdbProfileUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${TMDB_PROFILE_BASE}${path}`;
}