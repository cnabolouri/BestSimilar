from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.accounts.models import (
    UserPrivacySettings,
    UserProfile,
    UserSiteSettings,
    UserTastePreferences,
)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_account_related_models(sender, instance, created, **kwargs):
    if not created:
        return

    UserProfile.objects.get_or_create(
        user=instance,
        defaults={
            "display_name": instance.get_username(),
            "username_slug": instance.get_username(),
        },
    )
    UserPrivacySettings.objects.get_or_create(user=instance)
    UserSiteSettings.objects.get_or_create(user=instance)
    UserTastePreferences.objects.get_or_create(user=instance)
