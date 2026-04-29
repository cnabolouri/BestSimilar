from collections import Counter


def get_user_taste_profile(user):
    """
    Builds a taste profile from user behavior.

    Weights:
      Ratings >= 7  → +rating_value per genre (strong positive signal)
      Ratings <= 4  → -2.0 per genre (negative signal)
      Favorites     → +6.0 per genre
      Watch history → +1.5 per genre
      Watchlist     → tracked for exclusion only
    """
    from apps.interactions.models import (
        FavoriteTitle,
        TitleRating,
        WatchedTitle,
        WatchlistItem,
    )

    genre_counter = Counter()
    interacted_title_ids = set()

    ratings = (
        TitleRating.objects.filter(user=user)
        .select_related("title")
        .prefetch_related("title__genres")
    )
    for r in ratings:
        interacted_title_ids.add(r.title_id)
        if r.rating >= 7:
            for genre in r.title.genres.all():
                genre_counter[genre.name] += float(r.rating)
        elif r.rating <= 4:
            for genre in r.title.genres.all():
                genre_counter[genre.name] -= 2.0

    favorites = (
        FavoriteTitle.objects.filter(user=user)
        .select_related("title")
        .prefetch_related("title__genres")
    )
    for f in favorites:
        interacted_title_ids.add(f.title_id)
        for genre in f.title.genres.all():
            genre_counter[genre.name] += 6.0

    history = (
        WatchedTitle.objects.filter(user=user)
        .select_related("title")
        .prefetch_related("title__genres")
    )
    for h in history:
        interacted_title_ids.add(h.title_id)
        for genre in h.title.genres.all():
            genre_counter[genre.name] += 1.5

    for item in WatchlistItem.objects.filter(user=user).values_list("title_id", flat=True):
        interacted_title_ids.add(item)

    # Only keep genres with a net positive weight
    top_genres = [
        genre for genre, weight in genre_counter.most_common(10) if weight > 0
    ]

    return {
        "top_genres": top_genres,
        "interacted_title_ids": interacted_title_ids,
        "genre_weights": dict(genre_counter),
    }
