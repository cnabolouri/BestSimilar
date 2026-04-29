from rest_framework import status
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import UserPrivacySettings, UserProfile
from apps.accounts.authentication import CsrfExemptSessionAuthentication
from apps.catalog.models import Title
from apps.interactions.models import FavoriteTitle, WatchlistItem
from apps.interactions.serializers import (
    FavoriteTitleSerializer,
    TitleActionSerializer,
    WatchlistItemSerializer,
)
from apps.interactions.serializers_public import (
    PublicFavoritePersonPreviewSerializer,
    PublicFavoriteTitlePreviewSerializer,
    PublicHistoryPreviewSerializer,
    PublicRatingPreviewSerializer,
    PublicWatchlistPreviewSerializer,
)
from apps.people.models import Person
from apps.interactions.models import FavoritePerson
from apps.interactions.serializers import FavoritePersonSerializer, PersonActionSerializer
from apps.interactions.models import WatchedTitle
from apps.interactions.serializers import WatchedTitleSerializer
from apps.interactions.models import TitleRating
from apps.interactions.serializers import TitleRatingActionSerializer, TitleRatingSerializer


def get_public_profile_user_or_404(username):
    profile = get_object_or_404(
        UserProfile.objects.select_related("user"),
        Q(username_slug__iexact=username) | Q(user__username__iexact=username),
    )
    return profile.user


def assert_public_section_allowed(user, section):
    privacy, _ = UserPrivacySettings.objects.get_or_create(user=user)
    visibility_map = {
        "watchlist": privacy.show_watchlist,
        "favorites": privacy.show_favorite_titles or privacy.show_favorite_people,
        "favorite_titles": privacy.show_favorite_titles,
        "favorite_people": privacy.show_favorite_people,
        "history": privacy.show_watch_history,
        "ratings": privacy.show_ratings,
        "reviews": privacy.show_reviews,
    }

    if not visibility_map.get(section, False):
        raise PermissionDenied("This profile section is private.")


class MyInteractionSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        favorite_titles_count = FavoriteTitle.objects.filter(user=user).count()
        favorite_people_count = FavoritePerson.objects.filter(user=user).count()
        ratings = TitleRating.objects.filter(user=user)

        return Response(
            {
                "watchlist_count": WatchlistItem.objects.filter(user=user).count(),
                "favorites_count": favorite_titles_count + favorite_people_count,
                "favorite_titles_count": favorite_titles_count,
                "favorite_people_count": favorite_people_count,
                "watched_count": WatchedTitle.objects.filter(user=user).count(),
                "ratings_count": ratings.count(),
                "reviews_count": ratings.exclude(review="").count(),
            }
        )


class PublicProfileWatchlistAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        target_user = get_public_profile_user_or_404(username)
        assert_public_section_allowed(target_user, "watchlist")
        items = (
            WatchlistItem.objects.filter(user=target_user)
            .select_related("title")
            .order_by("-created_at")
        )
        return Response(PublicWatchlistPreviewSerializer(items, many=True).data)


class PublicProfileFavoritesAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        target_user = get_public_profile_user_or_404(username)
        privacy, _ = UserPrivacySettings.objects.get_or_create(user=target_user)
        show_favorite_titles = getattr(privacy, "show_favorite_titles", False)
        show_favorite_people = getattr(privacy, "show_favorite_people", False)

        if not show_favorite_titles and not show_favorite_people:
            raise PermissionDenied("This profile section is private.")

        title_favorites = FavoriteTitle.objects.none()
        person_favorites = FavoritePerson.objects.none()

        if show_favorite_titles:
            title_favorites = (
                FavoriteTitle.objects.filter(user=target_user)
                .select_related("title")
                .order_by("-created_at")
            )

        if show_favorite_people:
            person_favorites = (
                FavoritePerson.objects.filter(user=target_user)
                .select_related("person")
                .order_by("-created_at")
            )

        return Response(
            {
                "titles": PublicFavoriteTitlePreviewSerializer(
                    title_favorites,
                    many=True,
                ).data,
                "people": PublicFavoritePersonPreviewSerializer(
                    person_favorites,
                    many=True,
                ).data,
            }
        )


class PublicProfileHistoryAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        target_user = get_public_profile_user_or_404(username)
        assert_public_section_allowed(target_user, "history")
        history = (
            WatchedTitle.objects.filter(user=target_user)
            .select_related("title")
            .order_by("-watched_at")
        )
        return Response(PublicHistoryPreviewSerializer(history, many=True).data)


class PublicProfileRatingsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        target_user = get_public_profile_user_or_404(username)
        assert_public_section_allowed(target_user, "ratings")
        ratings = (
            TitleRating.objects.filter(user=target_user)
            .select_related("title")
            .order_by("-rated_at")
        )
        return Response(PublicRatingPreviewSerializer(ratings, many=True).data)


class PublicProfileReviewsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        target_user = get_public_profile_user_or_404(username)
        assert_public_section_allowed(target_user, "reviews")
        reviews = (
            TitleRating.objects.filter(user=target_user)
            .exclude(review="")
            .select_related("title")
            .order_by("-rated_at")
        )
        return Response(PublicRatingPreviewSerializer(reviews, many=True).data)


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
                "user_rating": (
                    TitleRating.objects.filter(user=request.user, title__slug=title_slug)
                    .values_list("rating", flat=True)
                    .first()
                ),
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
    
class TitleRatingsAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = TitleRating.objects.filter(user=request.user).select_related("title")
        return Response(TitleRatingSerializer(items, many=True).data)

    def post(self, request):
        serializer = TitleRatingActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        title = Title.objects.get(slug=serializer.validated_data["title_slug"])

        item, _ = TitleRating.objects.update_or_create(
            user=request.user,
            title=title,
            defaults={
                "rating": serializer.validated_data["rating"],
                "review": serializer.validated_data.get("review", ""),
            },
        )

        return Response(TitleRatingSerializer(item).data, status=status.HTTP_200_OK)


class TitleRatingRemoveAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, title_slug):
        TitleRating.objects.filter(user=request.user, title__slug=title_slug).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
