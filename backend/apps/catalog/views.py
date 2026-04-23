from django.db.models import Q
from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.catalog.models import Title
from apps.catalog.serializers import TitleListSerializer, TitleDetailSerializer


class TitleListAPIView(ListAPIView):
    serializer_class = TitleListSerializer

    def get_queryset(self):
        queryset = (
            Title.objects.all()
            .prefetch_related("genres")
            .order_by("-popularity", "name")
        )

        q = self.request.query_params.get("q")
        media_type = self.request.query_params.get("media_type")
        genre_name = self.request.query_params.get("genre")
        language = self.request.query_params.get("language")
        min_vote = self.request.query_params.get("min_vote")
        ordering = self.request.query_params.get("ordering")

        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) | Q(original_name__icontains=q)
            )

        if media_type in {"movie", "tv"}:
            queryset = queryset.filter(media_type=media_type)

        if genre_name:
            queryset = queryset.filter(genres__name__iexact=genre_name)

        if language:
            queryset = queryset.filter(original_language__iexact=language)

        if min_vote:
            try:
                queryset = queryset.filter(vote_average__gte=float(min_vote))
            except ValueError:
                pass

        allowed_ordering = {
            "popularity": "-popularity",
            "vote_average": "-vote_average",
            "release_date": "-release_date",
            "first_air_date": "-first_air_date",
            "name": "name",
        }

        if ordering in allowed_ordering:
            queryset = queryset.order_by(allowed_ordering[ordering])

        return queryset.distinct()


class TitleDetailAPIView(RetrieveAPIView):
    serializer_class = TitleDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Title.objects.all()
            .prefetch_related("genres", "keywords", "themes", "credits__person")
        )