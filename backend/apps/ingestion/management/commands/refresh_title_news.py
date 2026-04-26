from django.core.management.base import BaseCommand

from apps.catalog.models import Title
from apps.ingestion.news_client import GNewsClient
from apps.ingestion.news_upserts import attach_title_news


class Command(BaseCommand):
    help = "Refresh news for titles automatically"

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=25)
        parser.add_argument("--media-type", type=str, default=None)
        parser.add_argument("--slug", type=str, default=None)

    def handle(self, *args, **kwargs):
        limit = kwargs["limit"]
        media_type = kwargs.get("media_type")
        slug = kwargs.get("slug")

        queryset = Title.objects.all().order_by("-popularity", "name")

        if media_type in {"movie", "tv"}:
            queryset = queryset.filter(media_type=media_type)

        if slug:
            queryset = queryset.filter(slug=slug)

        queryset = queryset[:limit]

        client = GNewsClient()
        updated = 0

        for title in queryset:
            try:
                query = f'"{title.name}" movie OR tv OR streaming'
                payload = client.search_title_news(query=query, max_results=5)
                attach_title_news(title, payload)
                updated += 1
                self.stdout.write(f"Updated news: {title.name}")
            except Exception as exc:
                self.stdout.write(self.style.WARNING(f"Failed {title.name}: {exc}"))

        self.stdout.write(self.style.SUCCESS(f"Finished. Updated news for {updated} titles."))