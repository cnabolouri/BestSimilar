import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from django.conf import settings


class TMDBClient:
    def __init__(self) -> None:
        self.base_url = settings.TMDB_BASE_URL
        self.access_token = settings.TMDB_ACCESS_TOKEN
        self.session = requests.Session()
        retries = Retry(total=3, backoff_factor=2, status_forcelist=[429, 500, 502, 503, 504])
        self.session.mount("https://", HTTPAdapter(max_retries=retries))

    @property
    def headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        }

    def get(self, path: str, params: dict | None = None) -> dict:
        url = f"{self.base_url}{path}"
        response = self.session.get(url, headers=self.headers, params=params or {}, timeout=30)
        response.raise_for_status()
        return response.json()

    def get_movie_details(self, tmdb_id: int) -> dict:
        return self.get(
            f"/movie/{tmdb_id}",
            params={"append_to_response": "credits,keywords,release_dates"},
        )

    def get_tv_details(self, tmdb_id: int) -> dict:
        return self.get(
            f"/tv/{tmdb_id}",
            params={"append_to_response": "credits,keywords,content_ratings"},
        )

    def get_person_details(self, tmdb_id: int) -> dict:
        return self.get(f"/person/{tmdb_id}")

    def popular_people(self, page: int = 1) -> dict:
        return self.get("/person/popular", params={"page": page})

    def discover_movies(self, page: int = 1) -> dict:
        return self.get("/discover/movie", params={"page": page, "sort_by": "popularity.desc"})

    def discover_tv(self, page: int = 1) -> dict:
        return self.get("/discover/tv", params={"page": page, "sort_by": "popularity.desc"})

    def movie_genres(self) -> dict:
        return self.get("/genre/movie/list")

    def tv_genres(self) -> dict:
        return self.get("/genre/tv/list")
    
    def get_movie_watch_providers(self, tmdb_id: int) -> dict:
        return self.get(f"/movie/{tmdb_id}/watch/providers")

    def get_tv_watch_providers(self, tmdb_id: int) -> dict:
        return self.get(f"/tv/{tmdb_id}/watch/providers")