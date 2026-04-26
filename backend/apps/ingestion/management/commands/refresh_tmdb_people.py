from django.core.management.base import BaseCommand

from apps.ingestion.services import TMDBClient
from apps.ingestion.upserts import upsert_person
from apps.ingestion.models import RawTMDBPayload


class Command(BaseCommand):
    help = "Refresh popular people from TMDB"

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=100)
        parser.add_argument("--pages", type=int, default=5)

    def handle(self, *args, **options):
        limit = options["limit"]
        pages = options["pages"]

        client = TMDBClient()
        total_created = 0
        total_updated = 0

        for page in range(1, pages + 1):
            if total_created + total_updated >= limit:
                break

            try:
                result = client.popular_people(page=page)
                people = result.get("results", [])

                for person_data in people:
                    if total_created + total_updated >= limit:
                        break

                    try:
                        tmdb_id = person_data["id"]
                        details = client.get_person_details(tmdb_id)
                        
                        # Store raw payload
                        RawTMDBPayload.objects.create(
                            source_entity=RawTMDBPayload.SourceEntity.PERSON,
                            external_id=str(tmdb_id),
                            payload=details,
                        )
                        
                        person = upsert_person(details)

                        if person.pk:
                            total_updated += 1
                            self.stdout.write(f"Updated person: {person.name}")
                        else:
                            total_created += 1
                            self.stdout.write(f"Created person: {person.name}")

                    except Exception as exc:
                        self.stdout.write(
                            self.style.WARNING(f"Failed to process person {person_data.get('id')}: {exc}")
                        )

            except Exception as exc:
                self.stdout.write(self.style.ERROR(f"Failed to fetch page {page}: {exc}"))
                break

        self.stdout.write(
            self.style.SUCCESS(
                f"Finished. Created: {total_created}, Updated: {total_updated} people."
            )
        )