from rest_framework import serializers

from apps.catalog.models import Title


class SimilarTitleSerializer(serializers.ModelSerializer):
    genres = serializers.SerializerMethodField()
    cast_preview = serializers.SerializerMethodField()
    similarity_score = serializers.FloatField(read_only=True)
    similarity_reasons = serializers.ListField(child=serializers.CharField(), read_only=True)
    match_explanation = serializers.CharField(read_only=True)
    episode_duration_display = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = [
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
            "similarity_score",
            "similarity_reasons",
            "match_explanation",
        ]

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