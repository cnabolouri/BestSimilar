from django.core.management.base import BaseCommand

from apps.ingestion.services import TMDBClient
from apps.taxonomy.models import Genre


class Command(BaseCommand):
    help = "Sync movie and TV genres from TMDB"

    def handle(self, *args, **options):
        client = TMDBClient()

        movie_genres = client.movie_genres().get("genres", [])
        tv_genres = client.tv_genres().get("genres", [])

        seen = {}

        for item in movie_genres:
            seen.setdefault(item["id"], {"name": item["name"], "movie": False, "tv": False})
            seen[item["id"]]["movie"] = True

        for item in tv_genres:
            seen.setdefault(item["id"], {"name": item["name"], "movie": False, "tv": False})
            seen[item["id"]]["tv"] = True

        for tmdb_id, info in seen.items():
            if info["movie"] and info["tv"]:
                category = Genre.Category.BOTH
            elif info["movie"]:
                category = Genre.Category.MOVIE
            else:
                category = Genre.Category.TV

            Genre.objects.update_or_create(
                tmdb_id=tmdb_id,
                defaults={
                    "name": info["name"],
                    "category": category,
                },
            )

        self.stdout.write(self.style.SUCCESS("Genres synced successfully."))