from django.core.management.base import BaseCommand

from apps.people.models import Person
from apps.ingestion.news_client import GNewsClient
from apps.ingestion.person_news_upserts import attach_person_news


class Command(BaseCommand):
    help = "Refresh news for people"

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=25)
        parser.add_argument("--slug", type=str, default=None)

    def handle(self, *args, **kwargs):
        limit = kwargs["limit"]
        slug = kwargs.get("slug")

        queryset = Person.objects.all().order_by("-popularity", "name")

        if slug:
            queryset = queryset.filter(slug=slug)

        queryset = queryset[:limit]

        client = GNewsClient()
        updated = 0

        for person in queryset:
            try:
                query = f'"{person.name}" actor OR actress OR director OR film OR television'
                payload = client.search_title_news(query=query, max_results=5)
                attach_person_news(person, payload)
                updated += 1
                self.stdout.write(f"Updated person news: {person.name}")
            except Exception as exc:
                self.stdout.write(self.style.WARNING(f"Failed {person.name}: {exc}"))

        self.stdout.write(self.style.SUCCESS(f"Finished. Updated news for {updated} people."))