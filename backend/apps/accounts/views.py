from django.contrib.auth import login, logout
from django.db import models
from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.authentication import CsrfExemptSessionAuthentication
from apps.accounts.models import (
    UserPrivacySettings,
    UserProfile,
    UserSiteSettings,
    UserTastePreferences,
)
from apps.accounts.serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    PublicUserProfileSerializer,
    SignupSerializer,
    UserPrivacySettingsSerializer,
    UserProfileSerializer,
    UserSecuritySerializer,
    UserSerializer,
    UserSiteSettingsSerializer,
    UserTastePreferencesSerializer,
)
from apps.interactions.models import (
    FavoritePerson,
    FavoriteTitle,
    TitleRating,
    WatchedTitle,
    WatchlistItem,
)
from apps.interactions.serializers_public import (
    PublicFavoritePersonPreviewSerializer,
    PublicFavoriteTitlePreviewSerializer,
    PublicHistoryPreviewSerializer,
    PublicRatingPreviewSerializer,
    PublicWatchlistPreviewSerializer,
)


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class SignupAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        login(request, user)

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        login(request, user)

        return Response(UserSerializer(user).data)


class LogoutAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out."})


class ProfileAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={
                "display_name": request.user.get_username(),
                "username_slug": request.user.get_username(),
            },
        )
        return Response(UserProfileSerializer(profile).data)

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={
                "display_name": request.user.get_username(),
                "username_slug": request.user.get_username(),
            },
        )
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProfileSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        favorite_titles_count = FavoriteTitle.objects.filter(user=user).count()
        favorite_people_count = FavoritePerson.objects.filter(user=user).count()

        data = {
            "watchlist_count": WatchlistItem.objects.filter(user=user).count(),
            "favorite_titles_count": favorite_titles_count,
            "favorite_people_count": favorite_people_count,
            "favorites_count": favorite_titles_count + favorite_people_count,
            "watched_count": WatchedTitle.objects.filter(user=user).count(),
            "ratings_count": TitleRating.objects.filter(user=user).count(),
            "reviews_count": TitleRating.objects.filter(
                user=user,
            )
            .exclude(review="")
            .count(),
        }
        return Response(data)


class PrivacySettingsAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = UserPrivacySettings.objects.get_or_create(user=request.user)
        return Response(UserPrivacySettingsSerializer(settings).data)

    def patch(self, request):
        settings, _ = UserPrivacySettings.objects.get_or_create(user=request.user)
        serializer = UserPrivacySettingsSerializer(
            settings,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SiteSettingsAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = UserSiteSettings.objects.get_or_create(user=request.user)
        return Response(UserSiteSettingsSerializer(settings).data)

    def patch(self, request):
        settings, _ = UserSiteSettings.objects.get_or_create(user=request.user)
        serializer = UserSiteSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class TastePreferencesAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preferences, _ = UserTastePreferences.objects.get_or_create(user=request.user)
        return Response(UserTastePreferencesSerializer(preferences).data)

    def patch(self, request):
        preferences, _ = UserTastePreferences.objects.get_or_create(user=request.user)
        serializer = UserTastePreferencesSerializer(
            preferences,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SecurityAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })

    def patch(self, request):
        serializer = UserSecuritySerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "username": user.username,
            "email": user.email,
        })


class ChangePasswordAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)


class PublicProfileAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        profile = get_object_or_404(
            UserProfile.objects.select_related("user"),
            username_slug=username,
        )
        return Response(PublicUserProfileSerializer(profile).data)


class PublicProfileSearchAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip()

        if not query:
            return Response([])

        profiles = (
            UserProfile.objects.select_related("user")
            .filter(
                models.Q(username_slug__icontains=query)
                | models.Q(display_name__icontains=query)
                | models.Q(user__username__icontains=query)
            )
            .order_by("username_slug")[:20]
        )
        serializer = PublicUserProfileSerializer(profiles, many=True)
        return Response(serializer.data)


class PublicProfileSummaryAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        profile = get_object_or_404(
            UserProfile.objects.select_related("user"),
            username_slug=username,
        )
        target_user = profile.user
        privacy, _ = UserPrivacySettings.objects.get_or_create(user=target_user)

        data = {
            "watchlist_count": None,
            "favorites_count": None,
            "favorite_titles_count": None,
            "favorite_people_count": None,
            "watched_count": None,
            "ratings_count": None,
            "reviews_count": None,
            "visibility": {
                "watchlist": privacy.show_watchlist,
                "favorites": privacy.show_favorite_titles
                or privacy.show_favorite_people,
                "favorite_titles": privacy.show_favorite_titles,
                "favorite_people": privacy.show_favorite_people,
                "history": privacy.show_watch_history,
                "ratings": privacy.show_ratings,
                "reviews": privacy.show_reviews,
            },
        }

        if privacy.show_watchlist:
            data["watchlist_count"] = WatchlistItem.objects.filter(
                user=target_user,
            ).count()

        if privacy.show_favorite_titles:
            favorite_titles_count = FavoriteTitle.objects.filter(user=target_user).count()
            data["favorite_titles_count"] = favorite_titles_count

        if privacy.show_favorite_people:
            favorite_people_count = FavoritePerson.objects.filter(user=target_user).count()
            data["favorite_people_count"] = favorite_people_count

        if privacy.show_favorite_titles or privacy.show_favorite_people:
            data["favorites_count"] = (data["favorite_titles_count"] or 0) + (
                data["favorite_people_count"] or 0
            )

        if privacy.show_watch_history:
            data["watched_count"] = WatchedTitle.objects.filter(user=target_user).count()

        if privacy.show_ratings:
            data["ratings_count"] = TitleRating.objects.filter(user=target_user).count()

        if privacy.show_reviews:
            data["reviews_count"] = (
                TitleRating.objects.filter(user=target_user).exclude(review="").count()
            )

        return Response(data)


class PublicProfileOverviewAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        profile = get_object_or_404(
            UserProfile.objects.select_related("user"),
            username_slug=username,
        )
        target_user = profile.user
        privacy, _ = UserPrivacySettings.objects.get_or_create(user=target_user)

        visibility = {
            "watchlist": privacy.show_watchlist,
            "favorite_titles": privacy.show_favorite_titles,
            "favorite_people": privacy.show_favorite_people,
            "ratings": privacy.show_ratings,
            "reviews": privacy.show_reviews,
            "history": privacy.show_watch_history,
        }
        visibility["favorites"] = (
            visibility["favorite_titles"] or visibility["favorite_people"]
        )

        stats = {
            "watchlist_count": None,
            "favorites_count": None,
            "favorite_titles_count": None,
            "favorite_people_count": None,
            "ratings_count": None,
            "reviews_count": None,
            "watched_count": None,
        }
        previews = {
            "watchlist": [],
            "favorite_titles": [],
            "favorite_people": [],
            "ratings": [],
            "reviews": [],
            "history": [],
        }
        insights = {
            "top_genres": [],
            "top_years": [],
            "rating_breakdown": [],
        }

        public_title_ids = set()

        if privacy.show_watchlist:
            watchlist_qs = (
                WatchlistItem.objects.filter(user=target_user)
                .select_related("title")
                .order_by("-created_at")
            )
            stats["watchlist_count"] = watchlist_qs.count()
            previews["watchlist"] = PublicWatchlistPreviewSerializer(
                watchlist_qs[:8],
                many=True,
            ).data
            public_title_ids.update(watchlist_qs.values_list("title_id", flat=True))

        if privacy.show_favorite_titles:
            favorite_titles_qs = (
                FavoriteTitle.objects.filter(user=target_user)
                .select_related("title")
                .order_by("-created_at")
            )
            stats["favorite_titles_count"] = favorite_titles_qs.count()
            previews["favorite_titles"] = PublicFavoriteTitlePreviewSerializer(
                favorite_titles_qs[:8],
                many=True,
            ).data
            public_title_ids.update(
                favorite_titles_qs.values_list("title_id", flat=True),
            )

        if privacy.show_favorite_people:
            favorite_people_qs = (
                FavoritePerson.objects.filter(user=target_user)
                .select_related("person")
                .order_by("-created_at")
            )
            stats["favorite_people_count"] = favorite_people_qs.count()
            previews["favorite_people"] = PublicFavoritePersonPreviewSerializer(
                favorite_people_qs[:8],
                many=True,
            ).data

        if privacy.show_favorite_titles or privacy.show_favorite_people:
            stats["favorites_count"] = (stats["favorite_titles_count"] or 0) + (
                stats["favorite_people_count"] or 0
            )

        if privacy.show_ratings:
            ratings_qs = (
                TitleRating.objects.filter(user=target_user)
                .select_related("title")
                .order_by("-rated_at")
            )
            stats["ratings_count"] = ratings_qs.count()
            previews["ratings"] = PublicRatingPreviewSerializer(
                ratings_qs[:8],
                many=True,
            ).data
            public_title_ids.update(ratings_qs.values_list("title_id", flat=True))
            insights["rating_breakdown"] = list(
                ratings_qs.values("rating")
                .annotate(count=Count("id"))
                .order_by("rating"),
            )

        if privacy.show_reviews:
            reviews_qs = (
                TitleRating.objects.filter(user=target_user)
                .exclude(review="")
                .select_related("title")
                .order_by("-rated_at")
            )
            stats["reviews_count"] = reviews_qs.count()
            previews["reviews"] = PublicRatingPreviewSerializer(
                reviews_qs[:8],
                many=True,
            ).data
            public_title_ids.update(reviews_qs.values_list("title_id", flat=True))

        if privacy.show_watch_history:
            history_qs = (
                WatchedTitle.objects.filter(user=target_user)
                .select_related("title")
                .order_by("-watched_at")
            )
            stats["watched_count"] = history_qs.count()
            previews["history"] = PublicHistoryPreviewSerializer(
                history_qs[:8],
                many=True,
            ).data
            public_title_ids.update(history_qs.values_list("title_id", flat=True))

        if public_title_ids:
            from apps.catalog.models import Title

            visible_titles = Title.objects.filter(id__in=public_title_ids)
            genre_counts = (
                visible_titles.exclude(genres__name__isnull=True)
                .exclude(genres__name="")
                .values("genres__name")
                .annotate(count=Count("id"))
                .order_by("-count", "genres__name")[:8]
            )
            insights["top_genres"] = [
                {"name": item["genres__name"], "count": item["count"]}
                for item in genre_counts
            ]

            year_counts = {}
            for release_date, first_air_date in visible_titles.values_list(
                "release_date",
                "first_air_date",
            ):
                date_value = release_date or first_air_date
                if not date_value:
                    continue
                year_counts[date_value.year] = year_counts.get(date_value.year, 0) + 1

            insights["top_years"] = [
                {"year": year, "count": count}
                for year, count in sorted(
                    year_counts.items(),
                    key=lambda item: (-item[1], -item[0]),
                )[:8]
            ]

        return Response(
            {
                "profile": PublicUserProfileSerializer(profile).data,
                "visibility": visibility,
                "stats": stats,
                "previews": previews,
                "insights": insights,
            },
        )
