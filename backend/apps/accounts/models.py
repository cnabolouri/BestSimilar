from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    display_name = models.CharField(max_length=120, blank=True)
    username_slug = models.SlugField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(max_length=1000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.display_name or self.user.get_username()


class UserPrivacySettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="privacy_settings",
    )
    show_ratings = models.BooleanField(default=False)
    show_watchlist = models.BooleanField(default=False)
    show_favorite_titles = models.BooleanField(default=False)
    show_favorite_people = models.BooleanField(default=False)
    show_reviews = models.BooleanField(default=False)
    show_watch_history = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Privacy settings for {self.user}"


class UserSiteSettings(models.Model):
    THEME_SYSTEM = "system"
    THEME_LIGHT = "light"
    THEME_DARK = "dark"

    THEME_CHOICES = [
        (THEME_SYSTEM, "System"),
        (THEME_LIGHT, "Light"),
        (THEME_DARK, "Dark"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="site_settings",
    )
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default=THEME_SYSTEM)
    compact_cards = models.BooleanField(default=False)
    autoplay_trailers = models.BooleanField(default=False)
    reduce_animations = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Site settings for {self.user}"


class UserTastePreferences(models.Model):
    FORMAT_BOTH = "both"
    FORMAT_MOVIES = "movies"
    FORMAT_TV = "tv"

    FORMAT_CHOICES = [
        (FORMAT_BOTH, "Movies and TV"),
        (FORMAT_MOVIES, "Movies only"),
        (FORMAT_TV, "TV only"),
    ]

    CONTENT_ANY = "any"
    CONTENT_FAMILY = "family"
    CONTENT_PG13 = "pg13"
    CONTENT_MATURE = "mature"

    CONTENT_RATING_CHOICES = [
        (CONTENT_ANY, "Any rating"),
        (CONTENT_FAMILY, "Family friendly"),
        (CONTENT_PG13, "PG-13 and below"),
        (CONTENT_MATURE, "R / mature allowed"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="taste_preferences",
    )
    preferred_format = models.CharField(
        max_length=20,
        choices=FORMAT_CHOICES,
        default=FORMAT_BOTH,
    )
    content_rating_preference = models.CharField(
        max_length=20,
        choices=CONTENT_RATING_CHOICES,
        default=CONTENT_ANY,
    )
    favorite_genres = models.JSONField(default=list, blank=True)
    preferred_languages = models.JSONField(default=list, blank=True)
    preferred_countries = models.JSONField(default=list, blank=True)
    preferred_providers = models.JSONField(default=list, blank=True)
    avoided_genres = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Taste preferences for {self.user}"
