from django.db.models import Q
from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.catalog.models import Title
from apps.catalog.serializers import TitleListSerializer, TitleDetailSerializer


class TitleListAPIView(ListAPIView):
    serializer_class = TitleListSerializer
    def get_queryset(self):
        queryset = (
            Title.objects.all()
            .prefetch_related(
                "genres",
                "keywords",
                "themes",
                "credits__person",
                "watch_providers",
                "news_items",
            )
        )

        q = self.request.query_params.get("q")
        media_type = self.request.query_params.get("media_type")
        ordering = self.request.query_params.get("ordering")
        min_rating = self.request.query_params.get("min_rating")
        min_votes = self.request.query_params.get("min_votes")
        genre = self.request.query_params.get("genre")

        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) | Q(original_name__icontains=q)
            )

        if media_type in {"movie", "tv"}:
            queryset = queryset.filter(media_type=media_type)

        if min_rating:
            try:
                queryset = queryset.filter(vote_average__gte=float(min_rating))
            except ValueError:
                pass

        if min_votes:
            try:
                queryset = queryset.filter(vote_count__gte=int(min_votes))
            except ValueError:
                pass

        if genre:
            queryset = queryset.filter(genres__name__iexact=genre)

        ordering_map = {
            "popularity": ["-popularity", "-vote_count", "name"],
            "vote_average": ["-vote_average", "-vote_count", "name"],
            "vote_count": ["-vote_count", "-vote_average", "name"],
            "newest": ["-release_date", "-first_air_date", "name"],
            "oldest": ["release_date", "first_air_date", "name"],
        }

        queryset = queryset.order_by(*ordering_map.get(ordering, ordering_map["popularity"]))

        return queryset.distinct()


class TitleDetailAPIView(RetrieveAPIView):
    serializer_class = TitleDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Title.objects.all()
            .prefetch_related(
                "genres",
                "keywords",
                "themes",
                "credits__person",
                "watch_providers",
                "news_items",
            )
        )