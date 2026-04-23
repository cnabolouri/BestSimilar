# backend/apps/comments/models.py

from django.conf import settings
from django.db import models
from apps.catalog.models import TimeStampedModel, Title


class Comment(TimeStampedModel):
    class ModerationStatus(models.TextChoices):
        VISIBLE = "visible", "Visible"
        PENDING = "pending", "Pending"
        HIDDEN = "hidden", "Hidden"
        FLAGGED = "flagged", "Flagged"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="comments")

    body = models.TextField()
    spoiler_flag = models.BooleanField(default=False)
    moderation_status = models.CharField(
        max_length=20,
        choices=ModerationStatus.choices,
        default=ModerationStatus.VISIBLE,
        db_index=True,
    )

    def __str__(self) -> str:
        return f"Comment by {self.user} on {self.title}"


class CommentReport(TimeStampedModel):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="reports")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comment_reports")
    reason = models.CharField(max_length=255)

    class Meta:
        unique_together = ("comment", "user")