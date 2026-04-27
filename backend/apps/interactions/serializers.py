from rest_framework import serializers

from apps.catalog.models import Title
from apps.interactions.models import FavoriteTitle, WatchlistItem
from apps.people.models import Person
from apps.interactions.models import FavoritePerson
from apps.interactions.models import WatchedTitle
class TitleActionSerializer(serializers.Serializer):
    title_slug = serializers.CharField()


class WatchlistItemSerializer(serializers.ModelSerializer):
    title_name = serializers.CharField(source="title.name", read_only=True)
    title_slug = serializers.CharField(source="title.slug", read_only=True)
    media_type = serializers.CharField(source="title.media_type", read_only=True)
    poster_url = serializers.CharField(source="title.poster_url", read_only=True)

    class Meta:
        model = WatchlistItem
        fields = ["id", "title_name", "title_slug", "media_type", "poster_url", "created_at"]


class FavoriteTitleSerializer(serializers.ModelSerializer):
    title_name = serializers.CharField(source="title.name", read_only=True)
    title_slug = serializers.CharField(source="title.slug", read_only=True)
    media_type = serializers.CharField(source="title.media_type", read_only=True)
    poster_url = serializers.CharField(source="title.poster_url", read_only=True)

    class Meta:
        model = FavoriteTitle
        fields = ["id", "title_name", "title_slug", "media_type", "poster_url", "created_at"]
        
class PersonActionSerializer(serializers.Serializer):
    person_slug = serializers.CharField()


class FavoritePersonSerializer(serializers.ModelSerializer):
    person_name = serializers.CharField(source="person.name", read_only=True)
    person_slug = serializers.CharField(source="person.slug", read_only=True)
    known_for_department = serializers.CharField(source="person.known_for_department", read_only=True)
    profile_url = serializers.CharField(source="person.profile_url", read_only=True)

    class Meta:
        model = FavoritePerson
        fields = [
            "id",
            "person_name",
            "person_slug",
            "known_for_department",
            "profile_url",
            "created_at",
        ]
        
class WatchedTitleSerializer(serializers.ModelSerializer):
    title_name = serializers.CharField(source="title.name", read_only=True)
    title_slug = serializers.CharField(source="title.slug", read_only=True)
    media_type = serializers.CharField(source="title.media_type", read_only=True)
    poster_url = serializers.CharField(source="title.poster_url", read_only=True)

    class Meta:
        model = WatchedTitle
        fields = [
            "id",
            "title_name",
            "title_slug",
            "media_type",
            "poster_url",
            "watched_at",
        ]