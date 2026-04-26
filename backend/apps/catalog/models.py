# backend/apps/catalog/models.py

from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Title(TimeStampedModel):
    class MediaType(models.TextChoices):
        MOVIE = "movie", "Movie"
        TV = "tv", "TV"

    tmdb_id = models.PositiveBigIntegerField(unique=True, db_index=True)
    slug = models.SlugField(max_length=255, unique=True)

    name = models.CharField(max_length=255, db_index=True)
    original_name = models.CharField(max_length=255, blank=True)

    media_type = models.CharField(max_length=10, choices=MediaType.choices, db_index=True)
    status = models.CharField(max_length=100, blank=True)

    overview = models.TextField(blank=True)
    tagline = models.CharField(max_length=500, blank=True)

    original_language = models.CharField(max_length=20, blank=True)
    country_codes = models.JSONField(default=list, blank=True)

    poster_url = models.URLField(blank=True)
    backdrop_url = models.URLField(blank=True)

    release_date = models.DateField(null=True, blank=True)
    first_air_date = models.DateField(null=True, blank=True)
    last_air_date = models.DateField(null=True, blank=True)

    runtime_minutes = models.PositiveIntegerField(null=True, blank=True)
    episode_run_times = models.JSONField(default=list, blank=True)

    seasons_count = models.PositiveIntegerField(null=True, blank=True)
    episodes_count = models.PositiveIntegerField(null=True, blank=True)

    age_rating = models.CharField(max_length=50, blank=True)

    popularity = models.FloatField(default=0.0, db_index=True)
    vote_average = models.FloatField(default=0.0, db_index=True)
    vote_count = models.PositiveIntegerField(default=0)

    is_adult = models.BooleanField(default=False)
    raw_source_updated_at = models.DateTimeField(null=True, blank=True)

    genres = models.ManyToManyField(
        "taxonomy.Genre",
        blank=True,
        related_name="titles",
    )
    keywords = models.ManyToManyField(
        "taxonomy.Keyword",
        blank=True,
        related_name="titles",
    )
    themes = models.ManyToManyField(
        "taxonomy.Theme",
        blank=True,
        related_name="titles",
    )

    class Meta:
        ordering = ["-popularity", "name"]
        indexes = [
            models.Index(fields=["media_type", "release_date"]),
            models.Index(fields=["media_type", "first_air_date"]),
            models.Index(fields=["vote_average", "vote_count"]),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.media_type})"
    
class TitleWatchProvider(TimeStampedModel):
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="watch_providers")

    country_code = models.CharField(max_length=10, db_index=True, default="US")
    provider_type = models.CharField(max_length=20, db_index=True)  # flatrate, rent, buy, free
    provider_id = models.PositiveIntegerField()
    provider_name = models.CharField(max_length=255)
    logo_path = models.CharField(max_length=255, blank=True)
    provider_link = models.URLField(blank=True)
    affiliate_url = models.URLField(blank=True, null=True)  # For future monetization
    display_priority = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("title", "country_code", "provider_type", "provider_id")
        indexes = [
            models.Index(fields=["title", "country_code", "provider_type"]),
        ]

    def __str__(self):
        return f"{self.title.name} - {self.provider_name} ({self.provider_type})"
    
class TitleNewsItem(TimeStampedModel):
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="news_items")
    source_name = models.CharField(max_length=200)
    headline = models.CharField(max_length=500)
    summary = models.TextField(blank=True)
    url = models.URLField()
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return f"{self.title.name} - {self.headline}"