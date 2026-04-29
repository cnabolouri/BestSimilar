# backend/apps/interactions/models.py

from django.conf import settings
from django.db import models
from apps.catalog.models import TimeStampedModel, Title
from apps.people.models import Person
User = settings.AUTH_USER_MODEL

class FavoriteTitle(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorite_titles")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="favorited_by")

    class Meta:
        unique_together = ("user", "title")


class FavoritePerson(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorite_people")
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="favorited_by")

    class Meta:
        unique_together = ("user", "person")


class WatchlistItem(TimeStampedModel):
    class Status(models.TextChoices):
        PLANNED = "planned", "Planned"
        WATCHING = "watching", "Watching"
        COMPLETED = "completed", "Completed"
        DROPPED = "dropped", "Dropped"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="watchlist_items")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="watchlist_entries")

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED)
    user_rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ("user", "title")

class WatchedTitle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watched_titles")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="watched_by")
    watched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "title")
        ordering = ["-watched_at"]

    def __str__(self):
        return f"{self.user} watched {self.title}"
    
class TitleRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="title_ratings")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="user_ratings")
    rating = models.PositiveSmallIntegerField()
    review = models.TextField(blank=True)
    rated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "title")
        ordering = ["-rated_at"]

    def __str__(self):
        return f"{self.user} rated {self.title} {self.rating}/10"


class UserEpisodeRating(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="episode_ratings",
    )
    episode = models.ForeignKey(
        "catalog.TVEpisode",
        on_delete=models.CASCADE,
        related_name="user_ratings",
    )
    rating = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("user", "episode")]
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user} rated {self.episode} {self.rating}/10"