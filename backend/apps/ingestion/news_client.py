import requests
from django.conf import settings


class GNewsClient:
    BASE_URL = "https://gnews.io/api/v4"

    def __init__(self):
        self.api_key = settings.GNEWS_API_KEY

    def search_title_news(self, query: str, max_results: int = 5) -> dict:
        response = requests.get(
            f"{self.BASE_URL}/search",
            params={
                "q": query,
                "lang": "en",
                "max": max_results,
                "apikey": self.api_key,
            },
            timeout=20,
        )
        response.raise_for_status()
        return response.json()