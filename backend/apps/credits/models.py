# backend/apps/credits/models.py

from django.db import models
from apps.catalog.models import TimeStampedModel, Title
from apps.people.models import Person


class TitleCredit(TimeStampedModel):
    class RoleType(models.TextChoices):
        ACTOR = "actor", "Actor"
        DIRECTOR = "director", "Director"
        WRITER = "writer", "Writer"
        CREATOR = "creator", "Creator"
        PRODUCER = "producer", "Producer"

    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="credits")
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="credits")

    role_type = models.CharField(max_length=20, choices=RoleType.choices, db_index=True)
    character_name = models.CharField(max_length=255, blank=True)
    job_name = models.CharField(max_length=255, blank=True)
    billing_order = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ("title", "person", "role_type", "character_name", "job_name")
        indexes = [
            models.Index(fields=["title", "role_type"]),
            models.Index(fields=["person", "role_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.person.name} -> {self.title.name} [{self.role_type}]"