from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Title, TVEpisode, TVSeason
from apps.catalog.serializers import TVEpisodeSerializer, TVSeasonSerializer


class TVSeasonListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        title = get_object_or_404(Title, slug=slug, media_type="tv")
        seasons = title.seasons.all()
        return Response(TVSeasonSerializer(seasons, many=True).data)


class TVEpisodeListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        title = get_object_or_404(Title, slug=slug, media_type="tv")
        season_number = request.query_params.get("season")
        episodes = TVEpisode.objects.filter(title=title)
        if season_number:
            try:
                episodes = episodes.filter(season_number=int(season_number))
            except ValueError:
                pass
        episodes = episodes.order_by("season_number", "episode_number")
        return Response(
            TVEpisodeSerializer(episodes, many=True, context={"request": request}).data
        )


class TVEpisodeDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug, season_number, episode_number):
        title = get_object_or_404(Title, slug=slug, media_type="tv")
        episode = get_object_or_404(
            TVEpisode,
            title=title,
            season_number=season_number,
            episode_number=episode_number,
        )
        return Response(
            TVEpisodeSerializer(episode, context={"request": request}).data
        )
