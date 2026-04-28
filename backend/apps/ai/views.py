from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.authentication import CsrfExemptSessionAuthentication
from apps.ai.serializers import DiscoverRequestSerializer
from apps.ai.services import discover_titles_from_prompt
from apps.recommendations.serializers import SimilarTitleSerializer


class DiscoverAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
        serializer = DiscoverRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        prompt = serializer.validated_data["prompt"]
        media_type = serializer.validated_data.get("media_type")
        limit = serializer.validated_data.get("limit", 10)

        titles = discover_titles_from_prompt(
            prompt=prompt,
            media_type=media_type,
            limit=limit,
        )

        result_serializer = SimilarTitleSerializer(titles, many=True)

        return Response(
            {
                "prompt": prompt,
                "media_type": media_type,
                "count": len(result_serializer.data),
                "results": result_serializer.data,
            }
        )
