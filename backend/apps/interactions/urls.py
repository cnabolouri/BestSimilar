from django.urls import path
from apps.interactions.views import (
    FavoriteTitleRemoveAPIView,
    FavoriteTitlesAPIView,
    WatchlistAPIView,
    WatchlistRemoveAPIView,
    TitleInteractionStatusAPIView,
    FavoritePeopleAPIView,
    FavoritePersonRemoveAPIView,
    WatchedTitlesAPIView,
    WatchedTitleRemoveAPIView,
)

urlpatterns = [
    path("watchlist/", WatchlistAPIView.as_view(), name="watchlist"),
    path("watchlist/<slug:title_slug>/", WatchlistRemoveAPIView.as_view(), name="watchlist-remove"),
    path("favorites/titles/", FavoriteTitlesAPIView.as_view(), name="favorite-titles"),
    path("favorites/titles/<slug:title_slug>/", FavoriteTitleRemoveAPIView.as_view(), name="favorite-title-remove"),
    path("titles/<slug:title_slug>/status/", TitleInteractionStatusAPIView.as_view(), name="title-interaction-status"),
    path("favorites/people/", FavoritePeopleAPIView.as_view(), name="favorite-people"),
    path("favorites/people/<slug:person_slug>/", FavoritePersonRemoveAPIView.as_view(), name="favorite-person-remove"),
    path("history/", WatchedTitlesAPIView.as_view(), name="watched-titles"),
    path("history/<slug:title_slug>/", WatchedTitleRemoveAPIView.as_view(), name="watched-title-remove"),
]