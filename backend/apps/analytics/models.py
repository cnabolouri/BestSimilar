# backend/apps/analytics/models.py

from django.conf import settings
from django.db import models
from apps.catalog.models import TimeStampedModel, Title
from apps.people.models import Person


class InteractionEvent(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="interaction_events",
    )
    session_id = models.CharField(max_length=255, blank=True, db_index=True)
    event_type = models.CharField(max_length=100, db_index=True)

    query_text = models.TextField(blank=True)
    prompt_text = models.TextField(blank=True)

    title = models.ForeignKey(Title, null=True, blank=True, on_delete=models.SET_NULL)
    person = models.ForeignKey(Person, null=True, blank=True, on_delete=models.SET_NULL)

    result_position = models.PositiveIntegerField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["event_type", "created_at"]),
        ]