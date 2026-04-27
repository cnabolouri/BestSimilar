from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Title
from apps.interactions.models import FavoriteTitle, WatchlistItem
from apps.interactions.serializers import (
    FavoriteTitleSerializer,
    TitleActionSerializer,
    WatchlistItemSerializer,
)
from apps.accounts.authentication import CsrfExemptSessionAuthentication
from apps.people.models import Person
from apps.interactions.models import FavoritePerson
from apps.interactions.serializers import FavoritePersonSerializer, PersonActionSerializer
from apps.interactions.models import WatchedTitle
from apps.interactions.serializers import WatchedTitleSerializer

class WatchlistAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WatchlistItem.objects.filter(user=request.user).select_related("title")
        return Response(WatchlistItemSerializer(items, many=True).data)

    def post(self, request):
        serializer = TitleActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        title = Title.objects.get(slug=serializer.validated_data["title_slug"])
        item, created = WatchlistItem.objects.get_or_create(user=request.user, title=title)

        return Response(
            WatchlistItemSerializer(item).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class WatchlistRemoveAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, title_slug):
        WatchlistItem.objects.filter(user=request.user, title__slug=title_slug).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteTitlesAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = FavoriteTitle.objects.filter(user=request.user).select_related("title")
        return Response(FavoriteTitleSerializer(items, many=True).data)

    def post(self, request):
        serializer = TitleActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        title = Title.objects.get(slug=serializer.validated_data["title_slug"])
        item, created = FavoriteTitle.objects.get_or_create(user=request.user, title=title)

        return Response(
            FavoriteTitleSerializer(item).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class FavoriteTitleRemoveAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, title_slug):
        FavoriteTitle.objects.filter(user=request.user, title__slug=title_slug).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class TitleInteractionStatusAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, title_slug):
        return Response(
            {
                "in_watchlist": WatchlistItem.objects.filter(
                    user=request.user,
                    title__slug=title_slug,
                ).exists(),
                "is_favorite": FavoriteTitle.objects.filter(
                    user=request.user,
                    title__slug=title_slug,
                ).exists(),
                "is_watched": WatchedTitle.objects.filter(
                    user=request.user,
                    title__slug=title_slug,
                ).exists(),
            }
        )
        
class FavoritePeopleAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = FavoritePerson.objects.filter(user=request.user).select_related("person")
        return Response(FavoritePersonSerializer(items, many=True).data)

    def post(self, request):
        serializer = PersonActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        person = Person.objects.get(slug=serializer.validated_data["person_slug"])
        item, created = FavoritePerson.objects.get_or_create(user=request.user, person=person)

        return Response(
            FavoritePersonSerializer(item).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class FavoritePersonRemoveAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, person_slug):
        FavoritePerson.objects.filter(user=request.user, person__slug=person_slug).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class WatchedTitlesAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WatchedTitle.objects.filter(user=request.user).select_related("title")
        return Response(WatchedTitleSerializer(items, many=True).data)

    def post(self, request):
        serializer = TitleActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        title = Title.objects.get(slug=serializer.validated_data["title_slug"])
        item, created = WatchedTitle.objects.get_or_create(user=request.user, title=title)

        return Response(
            WatchedTitleSerializer(item).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class WatchedTitleRemoveAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, title_slug):
        WatchedTitle.objects.filter(user=request.user, title__slug=title_slug).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)