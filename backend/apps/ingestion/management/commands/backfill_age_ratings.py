from django.core.management.base import BaseCommand

from apps.catalog.models import Title
from apps.ingestion.models import RawTMDBPayload
from apps.ingestion.normalizers import extract_movie_age_rating, extract_tv_age_rating


class Command(BaseCommand):
    help = "Backfill title age ratings from stored raw TMDB payloads."

    def add_arguments(self, parser):
        parser.add_argument(
            "--overwrite",
            action="store_true",
            help="Update titles that already have an age rating.",
        )

    def handle(self, *args, **options):
        overwrite = options["overwrite"]
        updated = 0
        skipped = 0

        titles = Title.objects.all().only("id", "tmdb_id", "media_type", "age_rating")
        if not overwrite:
            titles = titles.filter(age_rating="")

        for title in titles.iterator():
            source_entity = (
                RawTMDBPayload.SourceEntity.MOVIE
                if title.media_type == Title.MediaType.MOVIE
                else RawTMDBPayload.SourceEntity.TV
            )
            raw_payload = (
                RawTMDBPayload.objects.filter(
                    source_entity=source_entity,
                    external_id=str(title.tmdb_id),
                )
                .order_by("-fetched_at", "-id")
                .first()
            )

            if not raw_payload:
                skipped += 1
                continue

            if title.media_type == Title.MediaType.MOVIE:
                age_rating = extract_movie_age_rating(raw_payload.payload)
            else:
                age_rating = extract_tv_age_rating(raw_payload.payload)

            if not age_rating:
                skipped += 1
                continue

            title.age_rating = age_rating
            title.save(update_fields=["age_rating", "updated_at"])
            updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Backfilled age ratings for {updated} titles. Skipped {skipped}."
            )
        )
