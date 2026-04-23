# backend/apps/taxonomy/models.py

from django.db import models
from apps.catalog.models import TimeStampedModel


class Genre(TimeStampedModel):
    class Category(models.TextChoices):
        MOVIE = "movie", "Movie"
        TV = "tv", "TV"
        BOTH = "both", "Both"

    tmdb_id = models.PositiveIntegerField(unique=True, db_index=True)
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=10, choices=Category.choices, default=Category.BOTH)

    def __str__(self) -> str:
        return self.name


class Theme(TimeStampedModel):
    class ThemeType(models.TextChoices):
        THEME = "theme", "Theme"
        MOOD = "mood", "Mood"
        TONE = "tone", "Tone"
        NARRATIVE = "narrative", "Narrative"
        SETTING = "setting", "Setting"

    name = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=20, choices=ThemeType.choices, db_index=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.type})"


class Keyword(TimeStampedModel):
    tmdb_id = models.PositiveIntegerField(unique=True, db_index=True)
    name = models.CharField(max_length=150, unique=True)

    def __str__(self) -> str:
        return self.name