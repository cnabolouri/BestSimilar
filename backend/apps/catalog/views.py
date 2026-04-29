from django.db.models import Q
from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.catalog.models import Title
from apps.catalog.serializers import TitleListSerializer, TitleDetailSerializer
from apps.accounts.utils import apply_user_taste_preferences


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
        country = self.request.query_params.get("country")
        year = self.request.query_params.get("year")
        language = self.request.query_params.get("language")
        age_rating = self.request.query_params.get("age_rating")
        provider = self.request.query_params.get("provider")
        personalized = self.request.query_params.get("personalized")

        if personalized == "true" and self.request.user.is_authenticated:
            queryset = apply_user_taste_preferences(queryset, self.request.user)

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

        if country:
            queryset = queryset.filter(country_codes__contains=[country])

        if year:
            try:
                year_int = int(year)
                queryset = queryset.filter(
                    Q(release_date__year=year_int) | Q(first_air_date__year=year_int)
                )
            except ValueError:
                pass

        if language:
            queryset = queryset.filter(original_language__iexact=language)

        if age_rating:
            queryset = queryset.filter(age_rating__iexact=age_rating)

        if provider:
            queryset = queryset.filter(watch_providers__provider_name__icontains=provider)

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
