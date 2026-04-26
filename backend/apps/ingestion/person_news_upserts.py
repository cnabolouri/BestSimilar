from django.utils.dateparse import parse_datetime

from apps.people.models import Person, PersonNewsItem


def attach_person_news(person: Person, payload: dict) -> None:
    articles = payload.get("articles", [])

    PersonNewsItem.objects.filter(person=person).delete()

    for article in articles[:10]:
        url = article.get("url", "")
        headline = article.get("title", "")

        if not url or not headline:
            continue

        PersonNewsItem.objects.create(
            person=person,
            source_name=(article.get("source") or {}).get("name", "Unknown source"),
            headline=headline[:500],
            summary=article.get("description", "") or "",
            url=url,
            published_at=parse_datetime(article.get("publishedAt"))
            if article.get("publishedAt")
            else None,
        )