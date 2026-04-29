from django.urls import path

from apps.catalog.views import TitleListAPIView, TitleDetailAPIView
from apps.catalog.views_tv_episodes import (
    TVEpisodeDetailView,
    TVEpisodeListView,
    TVSeasonListView,
)

urlpatterns = [
    path("titles/", TitleListAPIView.as_view(), name="title-list"),
    path("titles/<slug:slug>/", TitleDetailAPIView.as_view(), name="title-detail"),
    path("tv/<slug:slug>/seasons/", TVSeasonListView.as_view(), name="tv-seasons"),
    path("tv/<slug:slug>/episodes/", TVEpisodeListView.as_view(), name="tv-episodes"),
    path(
        "tv/<slug:slug>/episodes/<int:season_number>/<int:episode_number>/",
        TVEpisodeDetailView.as_view(),
        name="tv-episode-detail",
    ),
]