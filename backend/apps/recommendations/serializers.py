from rest_framework import serializers

from apps.catalog.models import Title


class SimilarTitleSerializer(serializers.ModelSerializer):
    genres = serializers.SerializerMethodField()
    similarity_score = serializers.FloatField(read_only=True)
    similarity_reasons = serializers.ListField(child=serializers.CharField(), read_only=True)

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
            "genres",
            "similarity_score",
            "similarity_reasons",
        ]

    def get_genres(self, obj):
        return [genre.name for genre in obj.genres.all()]