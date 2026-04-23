from rest_framework import serializers

from apps.catalog.models import Title
from apps.people.models import Person


class SearchTitleSerializer(serializers.ModelSerializer):
    result_type = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = [
            "result_type",
            "id",
            "tmdb_id",
            "slug",
            "name",
            "original_name",
            "media_type",
            "poster_url",
            "backdrop_url",
            "release_date",
            "first_air_date",
            "vote_average",
            "vote_count",
            "popularity",
        ]

    def get_result_type(self, obj):
        return "title"


class SearchPersonSerializer(serializers.ModelSerializer):
    result_type = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = [
            "result_type",
            "id",
            "tmdb_id",
            "slug",
            "name",
            "known_for_department",
            "profile_url",
            "popularity",
        ]

    def get_result_type(self, obj):
        return "person"