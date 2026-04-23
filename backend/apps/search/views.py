from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Title
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

        title_queryset = (
            Title.objects.filter(
                Q(name__icontains=q) | Q(original_name__icontains=q)
            )
            .prefetch_related("genres")
            .order_by("-popularity", "-vote_count", "name")[:limit]
        )

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