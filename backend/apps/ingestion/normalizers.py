from django.utils.text import slugify

from apps.catalog.models import Title
from apps.people.models import Person


def build_title_slug(name: str, tmdb_id: int) -> str:
    return f"{slugify(name)}-{tmdb_id}"


def build_person_slug(name: str, tmdb_id: int) -> str:
    return f"{slugify(name)}-{tmdb_id}"


def extract_movie_age_rating(data: dict, country_code: str = "US") -> str:
    release_dates = data.get("release_dates", {}).get("results", [])

    for country in release_dates:
        if country.get("iso_3166_1") != country_code:
            continue

        for release in country.get("release_dates", []):
            certification = release.get("certification", "")
            if certification:
                return certification

    return ""


def extract_tv_age_rating(data: dict, country_code: str = "US") -> str:
    content_ratings = data.get("content_ratings", {}).get("results", [])

    for country in content_ratings:
        if country.get("iso_3166_1") != country_code:
            continue

        return country.get("rating", "") or ""

    return ""


def normalize_movie_payload(data: dict) -> dict:
    return {
        "tmdb_id": data["id"],
        "slug": build_title_slug(data.get("title", ""), data["id"]),
        "name": data.get("title", ""),
        "original_name": data.get("original_title", "") or "",
        "media_type": Title.MediaType.MOVIE,
        "status": data.get("status", "") or "",
        "overview": data.get("overview", "") or "",
        "tagline": data.get("tagline", "") or "",
        "original_language": data.get("original_language", "") or "",
        "country_codes": [c["iso_3166_1"] for c in data.get("production_countries", [])],
        "poster_url": data.get("poster_path", "") or "",
        "backdrop_url": data.get("backdrop_path", "") or "",
        "release_date": data.get("release_date") or None,
        "runtime_minutes": data.get("runtime") or None,
        "age_rating": extract_movie_age_rating(data),
        "popularity": data.get("popularity", 0.0) or 0.0,
        "vote_average": data.get("vote_average", 0.0) or 0.0,
        "vote_count": data.get("vote_count", 0) or 0,
        "is_adult": data.get("adult", False),
    }


def normalize_tv_payload(data: dict) -> dict:
    return {
        "tmdb_id": data["id"],
        "slug": build_title_slug(data.get("name", ""), data["id"]),
        "name": data.get("name", ""),
        "original_name": data.get("original_name", "") or "",
        "media_type": Title.MediaType.TV,
        "status": data.get("status", "") or "",
        "overview": data.get("overview", "") or "",
        "tagline": data.get("tagline", "") or "",
        "original_language": data.get("original_language", "") or "",
        "country_codes": data.get("origin_country", []),
        "poster_url": data.get("poster_path", "") or "",
        "backdrop_url": data.get("backdrop_path", "") or "",
        "first_air_date": data.get("first_air_date") or None,
        "last_air_date": data.get("last_air_date") or None,
        "episode_run_times": data.get("episode_run_time", []),
        "seasons_count": data.get("number_of_seasons") or None,
        "episodes_count": data.get("number_of_episodes") or None,
        "age_rating": extract_tv_age_rating(data),
        "popularity": data.get("popularity", 0.0) or 0.0,
        "vote_average": data.get("vote_average", 0.0) or 0.0,
        "vote_count": data.get("vote_count", 0) or 0,
        "is_adult": data.get("adult", False),
    }


def normalize_person_payload(data: dict) -> dict:
    return {
        "tmdb_id": data["id"],
        "slug": build_person_slug(data.get("name", ""), data["id"]),
        "name": data.get("name", ""),
        "known_for_department": data.get("known_for_department", "") or "",
        "biography": data.get("biography", "") or "",
        "birthday": data.get("birthday") or None,
        "deathday": data.get("deathday") or None,
        "place_of_birth": data.get("place_of_birth", "") or "",
        "profile_url": data.get("profile_path", "") or "",
        "popularity": data.get("popularity", 0.0) or 0.0,
    }
