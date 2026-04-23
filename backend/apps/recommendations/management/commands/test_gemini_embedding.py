from django.core.management.base import BaseCommand
from apps.catalog.models import Title
from apps.recommendations.embeddings import build_embedding_text, generate_embedding


class Command(BaseCommand):
    help = "Test Gemini embedding generation on one title"

    def add_arguments(self, parser):
        parser.add_argument("--slug", type=str, default=None)

    def handle(self, *args, **kwargs):
        slug = kwargs.get("slug")

        if slug:
            title = Title.objects.prefetch_related("genres", "keywords").get(slug=slug)
        else:
            title = Title.objects.prefetch_related("genres", "keywords").first()

        if not title:
            self.stdout.write(self.style.ERROR("No title found in database."))
            return

        text = build_embedding_text(title)
        vector = generate_embedding(text)

        self.stdout.write(self.style.SUCCESS(f"Title: {title.name}"))
        self.stdout.write(f"Vector length: {len(vector)}")
        self.stdout.write(f"First 5 values: {vector[:5]}")