# backend/apps/interactions/models.py

from django.conf import settings
from django.db import models
from apps.catalog.models import TimeStampedModel, Title
from apps.people.models import Person


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