from django.core.management.base import BaseCommand

from apps.catalog.models import Title
from apps.recommendations.embeddings import build_embedding_text, generate_embedding
from apps.recommendations.models import TitleEmbedding
import time

class Command(BaseCommand):
    help = "Generate Gemini embeddings for titles"

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=None)
        parser.add_argument("--overwrite", action="store_true")
        parser.add_argument("--slug", type=str, default=None)

    def handle(self, *args, **kwargs):
        queryset = Title.objects.prefetch_related("genres", "keywords").all().order_by("-popularity", "id")
        limit = kwargs.get("limit")
        overwrite = kwargs.get("overwrite", False)
        slug = kwargs.get("slug")

        if slug:
            queryset = queryset.filter(slug=slug)

        if limit:
            queryset = queryset[:limit]

        processed = 0

        for title in queryset:
            existing = TitleEmbedding.objects.filter(
                title=title,
                embedding_source=TitleEmbedding.EmbeddingSource.COMBINED,
                model_name="gemini-embedding-001",
            ).first()

            if existing and not overwrite:
                continue

            text = build_embedding_text(title)
            vector = generate_embedding(text)

            TitleEmbedding.objects.update_or_create(
                title=title,
                embedding_source=TitleEmbedding.EmbeddingSource.COMBINED,
                model_name="gemini-embedding-001",
                defaults={"vector": vector},
            )

            processed += 1
            self.stdout.write(f"Embedded: {title.slug}")
            time.sleep(1)  # Add a delay to avoid hitting rate limits

        self.stdout.write(self.style.SUCCESS(f"Done. Embedded {processed} titles."))
        