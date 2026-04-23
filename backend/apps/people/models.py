# backend/apps/people/models.py

from django.db import models
from apps.catalog.models import TimeStampedModel


class Person(TimeStampedModel):
    tmdb_id = models.PositiveBigIntegerField(unique=True, db_index=True)
    slug = models.SlugField(max_length=255, unique=True)

    name = models.CharField(max_length=255, db_index=True)
    known_for_department = models.CharField(max_length=100, blank=True)
    biography = models.TextField(blank=True)

    birthday = models.DateField(null=True, blank=True)
    deathday = models.DateField(null=True, blank=True)
    place_of_birth = models.CharField(max_length=255, blank=True)

    profile_url = models.URLField(blank=True)
    popularity = models.FloatField(default=0.0, db_index=True)

    class Meta:
        ordering = ["-popularity", "name"]

    def __str__(self) -> str:
        return self.name