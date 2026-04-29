from django.core.management.base import BaseCommand

from apps.ingestion.services import TMDBClient
from apps.ingestion.upserts import upsert_movie, upsert_tv
from apps.ingestion.models import RawTMDBPayload


class Command(BaseCommand):
    help = "Seed initial popular/discover titles from TMDB"

    def add_arguments(self, parser):
        parser.add_argument("--movie-pages", type=int, default=3)
        parser.add_argument("--tv-pages", type=int, default=3)

    def handle(self, *args, **options):
        client = TMDBClient()

        movie_pages = options["movie_pages"]
        tv_pages = options["tv_pages"]

        for page in range(1, movie_pages + 1):
            result = client.discover_movies(page=page)
            for item in result.get("results", []):
                tmdb_id = item["id"]
                details = client.get_movie_details(tmdb_id)
                try:
                    watch_providers = client.get_movie_watch_providers(tmdb_id)
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Skipping watch providers for movie {tmdb_id}: {e}"))
                    watch_providers = {}

                RawTMDBPayload.objects.create(
                    source_entity=RawTMDBPayload.SourceEntity.MOVIE,
                    external_id=str(tmdb_id),
                    payload=details,
                )
                upsert_movie(details, watch_provider_data=watch_providers)

        for page in range(1, tv_pages + 1):
            result = client.discover_tv(page=page)
            for item in result.get("results", []):
                tmdb_id = item["id"]
                details = client.get_tv_details(tmdb_id)
                try:
                    watch_providers = client.get_tv_watch_providers(tmdb_id)
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Skipping watch providers for TV {tmdb_id}: {e}"))
                    watch_providers = {}

                RawTMDBPayload.objects.create(
                    source_entity=RawTMDBPayload.SourceEntity.TV,
                    external_id=str(tmdb_id),
                    payload=details,
                )
                upsert_tv(details, watch_provider_data=watch_providers)

        self.stdout.write(self.style.SUCCESS("Initial TMDB title seed completed."))