from rest_framework import serializers

from apps.credits.models import TitleCredit
from apps.people.models import Person, PersonNewsItem

class PersonCreditSerializer(serializers.ModelSerializer):
    title_id = serializers.IntegerField(source="title.id", read_only=True)
    title_name = serializers.CharField(source="title.name", read_only=True)
    title_slug = serializers.CharField(source="title.slug", read_only=True)
    title_media_type = serializers.CharField(source="title.media_type", read_only=True)
    title_poster_url = serializers.CharField(source="title.poster_url", read_only=True)
    title_release_date = serializers.DateField(source="title.release_date", read_only=True)
    title_first_air_date = serializers.DateField(source="title.first_air_date", read_only=True)
    title_vote_average = serializers.FloatField(source="title.vote_average", read_only=True)
    title_vote_count = serializers.IntegerField(source="title.vote_count", read_only=True)
    title_popularity = serializers.FloatField(source="title.popularity", read_only=True)
    title_runtime_minutes = serializers.IntegerField(source="title.runtime_minutes", read_only=True)
    title_seasons_count = serializers.IntegerField(source="title.seasons_count", read_only=True)
    title_episodes_count = serializers.IntegerField(source="title.episodes_count", read_only=True)
    title_genres = serializers.SerializerMethodField()
    title_episode_duration_display = serializers.SerializerMethodField()

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
            "title_release_date",
            "title_first_air_date",
            "title_vote_average",
            "title_vote_count",
            "title_popularity",
            "title_runtime_minutes",
            "title_episode_duration_display",
            "title_seasons_count",
            "title_episodes_count",
            "title_genres",
        ]

    def get_title_genres(self, obj):
        return [genre.name for genre in obj.title.genres.all()[:4]]

    def get_title_episode_duration_display(self, obj):
        runtimes = [
            rt for rt in obj.title.episode_run_times
            if isinstance(rt, int) and rt > 0
        ]
        if not runtimes:
            return None
        if len(set(runtimes)) == 1:
            return f"{runtimes[0]} min"
        return f"{min(runtimes)}–{max(runtimes)} min"


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

class PersonNewsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonNewsItem
        fields = [
            "source_name",
            "headline",
            "summary",
            "url",
            "published_at",
        ]

class PersonDetailSerializer(serializers.ModelSerializer):
    credits = PersonCreditSerializer(many=True, read_only=True)
    news_items = PersonNewsItemSerializer(many=True, read_only=True)
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
            "news_items",
        ]
        
class RelatedPersonSerializer(serializers.ModelSerializer):
    shared_titles_count = serializers.IntegerField(read_only=True)

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
            "shared_titles_count",
        ]