def apply_user_taste_preferences(queryset, user):
    from apps.accounts.models import UserTastePreferences

    preferences, _ = UserTastePreferences.objects.get_or_create(user=user)

    if preferences.preferred_format == UserTastePreferences.FORMAT_MOVIES:
        queryset = queryset.filter(media_type="movie")

    if preferences.preferred_format == UserTastePreferences.FORMAT_TV:
        queryset = queryset.filter(media_type="tv")

    if preferences.favorite_genres:
        queryset = queryset.filter(genres__name__in=preferences.favorite_genres)

    if preferences.avoided_genres:
        queryset = queryset.exclude(genres__name__in=preferences.avoided_genres)

    return queryset.distinct()
