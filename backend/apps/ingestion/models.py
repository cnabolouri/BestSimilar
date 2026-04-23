from django.db import models
from apps.catalog.models import TimeStampedModel


class RawTMDBPayload(TimeStampedModel):
    class SourceEntity(models.TextChoices):
        MOVIE = "movie", "Movie"
        TV = "tv", "TV"
        PERSON = "person", "Person"
        CREDIT = "credit", "Credit"
        KEYWORD = "keyword", "Keyword"

    source_entity = models.CharField(max_length=20, choices=SourceEntity.choices, db_index=True)
    external_id = models.CharField(max_length=100, db_index=True)
    payload = models.JSONField()
    fetched_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["source_entity", "external_id"]),
        ]

    def __str__(self) -> str:
        return f"{self.source_entity}:{self.external_id}"