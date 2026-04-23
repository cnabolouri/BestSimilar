from django.db.models import Prefetch, Q
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Title
from apps.credits.models import TitleCredit
from apps.people.models import Person
from apps.search.serializers import SearchTitleSerializer, SearchPersonSerializer


class UnifiedSearchAPIView(APIView):
    def get(self, request):
        q = request.query_params.get("q", "").strip()
        limit = request.query_params.get("limit", 10)

        try:
            limit = int(limit)
        except ValueError:
            limit = 10

        if not q:
            return Response(
                {
                    "query": q,
                    "titles_count": 0,
                    "people_count": 0,
                    "titles": [],
                    "people": [],
                }
            )

        ordering = request.query_params.get("ordering")
        media_type = request.query_params.get("media_type")

        title_queryset = Title.objects.filter(
            Q(name__icontains=q) | Q(original_name__icontains=q)
        )

        if media_type in {"movie", "tv"}:
            title_queryset = title_queryset.filter(media_type=media_type)

        title_queryset = title_queryset.prefetch_related(
            "genres",
            Prefetch(
                "credits",
                queryset=TitleCredit.objects.select_related("person").filter(role_type="actor"),
            ),
        )

        allowed_ordering = {
            "vote_average": ["-vote_average", "-vote_count", "name"],
            "vote_count": ["-vote_count", "-vote_average", "name"],
            "popularity": ["-popularity", "-vote_count", "name"],
            "newest": ["-release_date", "-first_air_date", "name"],
        }

        if ordering in allowed_ordering:
            title_queryset = title_queryset.order_by(*allowed_ordering[ordering])
        else:
            title_queryset = title_queryset.order_by("-popularity", "-vote_count", "name")

        title_queryset = title_queryset[:limit]

        person_queryset = (
            Person.objects.filter(
                Q(name__icontains=q) | Q(known_for_department__icontains=q)
            )
            .order_by("-popularity", "name")[:limit]
        )

        title_data = SearchTitleSerializer(title_queryset, many=True).data
        person_data = SearchPersonSerializer(person_queryset, many=True).data

        return Response(
            {
                "query": q,
                "titles_count": len(title_data),
                "people_count": len(person_data),
                "titles": title_data,
                "people": person_data,
            }
        )