from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Title
from apps.recommendations.serializers import SimilarTitleSerializer
from apps.recommendations.services import get_similar_titles


class SimilarTitlesAPIView(APIView):
    def get(self, request, slug):
        source_title = get_object_or_404(
            Title.objects.prefetch_related("genres", "keywords", "credits__person"),
            slug=slug,
        )

        limit = request.query_params.get("limit", 20)
        try:
            limit = int(limit)
        except ValueError:
            limit = 20

        similar_titles = get_similar_titles(source_title, limit=limit)
        serializer = SimilarTitleSerializer(similar_titles, many=True)

        return Response(
            {
                "source_title": {
                    "id": source_title.id,
                    "name": source_title.name,
                    "slug": source_title.slug,
                    "media_type": source_title.media_type,
                },
                "count": len(serializer.data),
                "results": serializer.data,
            }
        )