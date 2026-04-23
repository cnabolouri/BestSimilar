from django.db import models
from pgvector.django import VectorField

from apps.catalog.models import TimeStampedModel, Title


class TitleEmbedding(TimeStampedModel):
    class EmbeddingSource(models.TextChoices):
        OVERVIEW = "overview", "Overview"
        COMBINED = "combined", "Combined"

    title = models.ForeignKey(
        Title,
        on_delete=models.CASCADE,
        related_name="embeddings",
    )
    embedding_source = models.CharField(
        max_length=20,
        choices=EmbeddingSource.choices,
        default=EmbeddingSource.COMBINED,
    )
    model_name = models.CharField(max_length=100, default="gemini-embedding-001")
    vector = VectorField(dimensions=3072)  # replace if your test prints a different size

    class Meta:
        unique_together = ("title", "embedding_source", "model_name")

    def __str__(self) -> str:
        return f"{self.title.name} [{self.model_name}]"