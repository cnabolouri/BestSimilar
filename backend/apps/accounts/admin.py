from django.contrib import admin

from apps.accounts.models import (
    UserPrivacySettings,
    UserProfile,
    UserSiteSettings,
    UserTastePreferences,
)


admin.site.register(UserProfile)
admin.site.register(UserPrivacySettings)
admin.site.register(UserSiteSettings)
admin.site.register(UserTastePreferences)
