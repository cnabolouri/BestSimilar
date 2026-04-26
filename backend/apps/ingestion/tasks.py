from celery import shared_task

from apps.catalog.models import Title
from apps.ingestion.news_client import GNewsClient
from apps.ingestion.news_upserts import attach_title_news

from apps.people.models import Person
from apps.ingestion.person_news_upserts import attach_person_news


@shared_task
def refresh_person_news_task(limit: int = 25) -> str:
    queryset = Person.objects.all().order_by("-popularity", "name")[:limit]

    client = GNewsClient()
    updated = 0

    for person in queryset:
        try:
            query = f'"{person.name}" actor OR actress OR director OR film OR television'
            payload = client.search_title_news(query=query, max_results=5)
            attach_person_news(person, payload)
            updated += 1
        except Exception:
            continue

    return f"Updated news for {updated} people."

@shared_task
def refresh_title_news_task(limit: int = 25, media_type: str | None = None) -> str:
    queryset = Title.objects.all().order_by("-popularity", "name")

    if media_type in {"movie", "tv"}:
        queryset = queryset.filter(media_type=media_type)

    queryset = queryset[:limit]

    client = GNewsClient()
    updated = 0

    for title in queryset:
        try:
            query = f'"{title.name}" movie OR tv OR streaming'
            payload = client.search_title_news(query=query, max_results=5)
            attach_title_news(title, payload)
            updated += 1
        except Exception:
            continue

    return f"Updated news for {updated} titles."