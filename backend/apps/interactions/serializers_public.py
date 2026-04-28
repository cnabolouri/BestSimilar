from rest_framework import serializers

from apps.interactions.models import (
    FavoritePerson,
    FavoriteTitle,
    TitleRating,
    WatchedTitle,
    WatchlistItem,
)


class PublicTitleMiniSerializer(serializers.Serializer):
    slug = serializers.CharField()
    title = serializers.SerializerMethodField()
    poster_url = serializers.SerializerMethodField()
    media_type = serializers.SerializerMethodField()
    release_year = serializers.SerializerMethodField()
    vote_average = serializers.SerializerMethodField()

    def get_title(self, obj):
        return (
            getattr(obj, "title", None)
            or getattr(obj, "name", None)
            or getattr(obj, "original_title", None)
            or getattr(obj, "original_name", None)
            or "Untitled"
        )

    def get_poster_url(self, obj):
        return (
            getattr(obj, "poster_url", None)
            or getattr(obj, "poster_path", None)
            or getattr(obj, "image_url", None)
            or ""
        )

    def get_media_type(self, obj):
        return getattr(obj, "media_type", None) or getattr(obj, "type", None) or ""

    def get_release_year(self, obj):
        value = getattr(obj, "release_year", None) or getattr(obj, "year", None)
        if value:
            return value

        release_date = (
            getattr(obj, "release_date", None)
            or getattr(obj, "first_air_date", None)
        )
        return release_date.year if release_date else None

    def get_vote_average(self, obj):
        return (
            getattr(obj, "vote_average", None)
            or getattr(obj, "tmdb_rating", None)
            or getattr(obj, "rating", None)
            or None
        )


class PublicPersonMiniSerializer(serializers.Serializer):
    slug = serializers.CharField()
    name = serializers.CharField()
    profile_url = serializers.SerializerMethodField()
    known_for_department = serializers.SerializerMethodField()

    def get_profile_url(self, obj):
        return (
            getattr(obj, "profile_url", None)
            or getattr(obj, "profile_path", None)
            or getattr(obj, "image_url", None)
            or ""
        )

    def get_known_for_department(self, obj):
        return getattr(obj, "known_for_department", None) or ""


class PublicWatchlistPreviewSerializer(serializers.ModelSerializer):
    title = PublicTitleMiniSerializer(read_only=True)

    class Meta:
        model = WatchlistItem
        fields = ["id", "title", "created_at"]


class PublicFavoriteTitlePreviewSerializer(serializers.ModelSerializer):
    title = PublicTitleMiniSerializer(read_only=True)

    class Meta:
        model = FavoriteTitle
        fields = ["id", "title", "created_at"]


class PublicFavoritePersonPreviewSerializer(serializers.ModelSerializer):
    person = PublicPersonMiniSerializer(read_only=True)

    class Meta:
        model = FavoritePerson
        fields = ["id", "person", "created_at"]


class PublicRatingPreviewSerializer(serializers.ModelSerializer):
    title = PublicTitleMiniSerializer(read_only=True)
    updated_at = serializers.DateTimeField(source="rated_at", read_only=True)

    class Meta:
        model = TitleRating
        fields = ["id", "title", "rating", "review", "updated_at"]


class PublicHistoryPreviewSerializer(serializers.ModelSerializer):
    title = PublicTitleMiniSerializer(read_only=True)
    created_at = serializers.DateTimeField(source="watched_at", read_only=True)

    class Meta:
        model = WatchedTitle
        fields = ["id", "title", "created_at"]
