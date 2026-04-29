from django.core.management.base import BaseCommand, CommandError
from django.utils.dateparse import parse_date

from apps.catalog.models import Title, TVEpisode, TVSeason
from apps.ingestion.services import TMDBClient


class Command(BaseCommand):
    help = "Import TV seasons and episodes from TMDB for a TV title."

    def add_arguments(self, parser):
        parser.add_argument("--slug", required=True, help="Title slug")
        parser.add_argument("--season", type=int, default=None, help="Import a single season number")
        parser.add_argument("--language", default="en-US")
        parser.add_argument(
            "--include-specials",
            action="store_true",
            help="Also import season 0 (specials)",
        )

    def handle(self, *args, **options):
        slug = options["slug"]
        language = options["language"]
        selected_season = options["season"]
        include_specials = options["include_specials"]

        try:
            title = Title.objects.get(slug=slug, media_type="tv")
        except Title.DoesNotExist:
            raise CommandError(f"No TV title found with slug '{slug}'.")

        if not title.tmdb_id:
            raise CommandError("Title does not have a tmdb_id.")

        client = TMDBClient()

        if selected_season is not None:
            seasons_to_import = [selected_season]
        else:
            seasons_to_import = self._get_season_numbers(
                title, language, include_specials, client
            )

        for season_number in seasons_to_import:
            self._import_season(title, season_number, language, client)

    def _get_season_numbers(self, title, language, include_specials, client):
        data = client.get(
            f"/tv/{title.tmdb_id}",
            params={"language": language},
        )

        seasons = data.get("seasons") or []
        numbers = [
            s["season_number"]
            for s in seasons
            if s.get("season_number") is not None
        ]

        if not include_specials:
            numbers = [n for n in numbers if n > 0]

        if not numbers:
            raise CommandError("No seasons found for this title on TMDB.")

        return numbers

    def _import_season(self, title, season_number, language, client):
        data = client.get(
            f"/tv/{title.tmdb_id}/season/{season_number}",
            params={"language": language},
        )

        season, _ = TVSeason.objects.update_or_create(
            title=title,
            season_number=data.get("season_number") or season_number,
            defaults={
                "tmdb_id": data.get("id"),
                "name": data.get("name") or f"Season {season_number}",
                "overview": data.get("overview") or "",
                "poster_path": data.get("poster_path") or "",
                "air_date": parse_date(data.get("air_date") or ""),
                "episode_count": len(data.get("episodes") or []),
                "vote_average": data.get("vote_average"),
            },
        )

        count = 0
        for ep in data.get("episodes") or []:
            TVEpisode.objects.update_or_create(
                title=title,
                season_number=ep.get("season_number") or season_number,
                episode_number=ep.get("episode_number"),
                defaults={
                    "season": season,
                    "tmdb_id": ep.get("id"),
                    "name": ep.get("name") or "",
                    "overview": ep.get("overview") or "",
                    "still_path": ep.get("still_path") or "",
                    "air_date": parse_date(ep.get("air_date") or ""),
                    "runtime": ep.get("runtime"),
                    "vote_average": ep.get("vote_average"),
                    "vote_count": ep.get("vote_count"),
                },
            )
            count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Season {season_number}: {count} episodes imported for '{title}'."
            )
        )
