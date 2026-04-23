from rest_framework import serializers

from apps.people.models import Person
from apps.credits.models import TitleCredit


class PersonCreditSerializer(serializers.ModelSerializer):
    title_id = serializers.IntegerField(source="title.id", read_only=True)
    title_name = serializers.CharField(source="title.name", read_only=True)
    title_slug = serializers.CharField(source="title.slug", read_only=True)
    title_media_type = serializers.CharField(source="title.media_type", read_only=True)
    title_poster_url = serializers.CharField(source="title.poster_url", read_only=True)

    class Meta:
        model = TitleCredit
        fields = [
            "id",
            "role_type",
            "character_name",
            "job_name",
            "billing_order",
            "title_id",
            "title_name",
            "title_slug",
            "title_media_type",
            "title_poster_url",
        ]


class PersonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = [
            "id",
            "tmdb_id",
            "slug",
            "name",
            "known_for_department",
            "profile_url",
            "popularity",
        ]


class PersonDetailSerializer(serializers.ModelSerializer):
    credits = PersonCreditSerializer(many=True, read_only=True)

    class Meta:
        model = Person
        fields = [
            "id",
            "tmdb_id",
            "slug",
            "name",
            "known_for_department",
            "biography",
            "birthday",
            "deathday",
            "place_of_birth",
            "profile_url",
            "popularity",
            "credits",
            "created_at",
            "updated_at",
        ]