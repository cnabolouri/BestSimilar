from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify

from apps.accounts.models import (
    UserPrivacySettings,
    UserProfile,
    UserSiteSettings,
    UserTastePreferences,
)


def _build_username_slug(user) -> str:
    """Build a safe slug from username or email prefix."""
    base = user.username or (user.email.split("@")[0] if user.email else "user")
    return slugify(base) or "user"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_account_related_models(sender, instance, created, **kwargs):
    if not created:
        return

    display_name = (
        instance.get_full_name()
        or instance.get_username()
        or instance.email.split("@")[0]
        or "User"
    )

    UserProfile.objects.get_or_create(
        user=instance,
        defaults={
            "display_name": display_name,
            "username_slug": _build_username_slug(instance),
        },
    )
    UserPrivacySettings.objects.get_or_create(user=instance)
    UserSiteSettings.objects.get_or_create(user=instance)
    UserTastePreferences.objects.get_or_create(user=instance)
