from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Title
from apps.catalog.serializers import TitleListSerializer
from apps.recommendations.scoring import apply_preference_and_behavior_boosts


class PersonalizedRecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        queryset = Title.objects.prefetch_related("genres", "watch_providers")
        queryset, taste = apply_preference_and_behavior_boosts(queryset, user)

        interacted_ids = taste.get("interacted_title_ids") or set()
        if interacted_ids:
            queryset = queryset.exclude(id__in=interacted_ids)

        queryset = queryset.order_by(
            "-preference_boost",
            "-behavior_boost",
            "-vote_average",
            "-popularity",
        )

        results = list(queryset[:24])

        # Fallback: if scoring produced nothing, return top-rated unseen titles.
        if not results:
            fallback = (
                Title.objects.exclude(id__in=interacted_ids)
                .order_by("-vote_average", "-popularity")
                .distinct()[:24]
            )
            results = list(fallback)

        serializer = TitleListSerializer(results, many=True)

        return Response(
            {
                "results": serializer.data,
                "meta": {
                    "top_genres": taste.get("top_genres", []),
                    "count": len(serializer.data),
                },
            }
        )
