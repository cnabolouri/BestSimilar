from django.db.models import Case, FloatField, Value, When


def apply_preference_and_behavior_boosts(queryset, user):
    """
    Annotates queryset with preference_boost and behavior_boost scores.
    Also applies hard exclusion for avoided_genres.
    Returns (annotated_queryset, taste_profile).
    """
    from apps.accounts.models import UserTastePreferences
    from apps.recommendations.user_taste import get_user_taste_profile

    preferences, _ = UserTastePreferences.objects.get_or_create(user=user)
    taste = get_user_taste_profile(user)

    preference_whens = []
    behavior_whens = []

    # Format preference
    if preferences.preferred_format == UserTastePreferences.FORMAT_MOVIES:
        preference_whens.append(When(media_type="movie", then=Value(0.20)))
    elif preferences.preferred_format == UserTastePreferences.FORMAT_TV:
        preference_whens.append(When(media_type="tv", then=Value(0.20)))

    # Explicit genre preference
    if preferences.favorite_genres:
        preference_whens.append(
            When(genres__name__in=preferences.favorite_genres, then=Value(0.30))
        )

    # Language preference
    if preferences.preferred_languages:
        preference_whens.append(
            When(
                original_language__in=preferences.preferred_languages,
                then=Value(0.10),
            )
        )

    # Provider preference — field name matches catalog filter: watch_providers__provider_name
    if preferences.preferred_providers:
        preference_whens.append(
            When(
                watch_providers__provider_name__in=preferences.preferred_providers,
                then=Value(0.10),
            )
        )

    # Behavioral genre boost from ratings/favorites/history
    if taste["top_genres"]:
        behavior_whens.append(
            When(genres__name__in=taste["top_genres"], then=Value(0.35))
        )

    queryset = queryset.annotate(
        preference_boost=Case(
            *preference_whens,
            default=Value(0.0),
            output_field=FloatField(),
        ),
        behavior_boost=Case(
            *behavior_whens,
            default=Value(0.0),
            output_field=FloatField(),
        ),
    )

    # Hard exclusion for avoided genres
    if preferences.avoided_genres:
        queryset = queryset.exclude(genres__name__in=preferences.avoided_genres)

    return queryset.distinct(), taste
