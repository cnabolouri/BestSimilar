from django.utils.dateparse import parse_datetime

from apps.catalog.models import Title, TitleNewsItem


def attach_title_news(title: Title, payload: dict) -> None:
    articles = payload.get("articles", [])

    # refresh strategy: replace recent ingested news each run
    TitleNewsItem.objects.filter(title=title).delete()

    for article in articles[:10]:
        source_name_raw = (article.get("source") or {}).get("name", "Unknown source")
        source_name_truncated = source_name_raw[:200]
        
        # Debug logging
        if len(source_name_raw) > 200:
            print(f"DEBUG: {title.name} source_name truncated from {len(source_name_raw)} to {len(source_name_truncated)}: {source_name_raw[:220]}")
        
        TitleNewsItem.objects.create(
            title=title,
            source_name=source_name_truncated,
            headline=article.get("title", "")[:500],
            summary=article.get("description", "") or "",
            url=article.get("url", ""),
            published_at=parse_datetime(article.get("publishedAt")) if article.get("publishedAt") else None,
        )