from rest_framework import serializers

from apps.catalog.models import Title
from apps.people.models import Person


class SearchTitleSerializer(serializers.ModelSerializer):
    result_type = serializers.SerializerMethodField()
    genres = serializers.SerializerMethodField()
    cast_preview = serializers.SerializerMethodField()
    episode_duration_display = serializers.SerializerMethodField()

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
            "overview",
            "runtime_minutes",
            "episode_run_times",
            "episode_duration_display",
            "seasons_count",
            "episodes_count",
            "genres",
            "cast_preview",
        ]

    def get_result_type(self, obj):
        return "title"

    def get_genres(self, obj):
        return [genre.name for genre in obj.genres.all()[:4]]

    def get_cast_preview(self, obj):
        return list(
            obj.credits.filter(role_type="actor")
            .order_by("billing_order", "id")
            .values_list("person__name", flat=True)[:3]
        )

    def get_episode_duration_display(self, obj):
        runtimes = [rt for rt in obj.episode_run_times if isinstance(rt, int) and rt > 0]
        if not runtimes:
            return None
        if len(set(runtimes)) == 1:
            return f"{runtimes[0]} min"
        return f"{min(runtimes)}–{max(runtimes)} min"


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