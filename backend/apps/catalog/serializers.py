from rest_framework import serializers

from apps.catalog.models import Title, TitleNewsItem
from apps.taxonomy.models import Genre, Keyword, Theme
from apps.credits.models import TitleCredit

from apps.catalog.models import TitleWatchProvider


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "tmdb_id", "name", "category"]


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ["id", "tmdb_id", "name"]


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ["id", "name", "type"]
        
class TitleNewsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TitleNewsItem
        fields = [
            "source_name",
            "headline",
            "summary",
            "url",
            "published_at",
        ]


class TitleWatchProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = TitleWatchProvider
        fields = [
            "country_code",
            "provider_type",
            "provider_id",
            "provider_name",
            "logo_path",
            "provider_link",
            "affiliate_url",
            "display_priority",
        ]
class TitleCreditSerializer(serializers.ModelSerializer):
    person_id = serializers.IntegerField(source="person.id", read_only=True)
    person_name = serializers.CharField(source="person.name", read_only=True)
    person_slug = serializers.CharField(source="person.slug", read_only=True)
    person_profile_url = serializers.CharField(source="person.profile_url", read_only=True)

    class Meta:
        model = TitleCredit
        fields = [
            "id",
            "role_type",
            "character_name",
            "job_name",
            "billing_order",
            "person_id",
            "person_name",
            "person_slug",
            "person_profile_url",
        ]


class TitleListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

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
        ]


class TitleDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    keywords = KeywordSerializer(many=True, read_only=True)
    themes = ThemeSerializer(many=True, read_only=True)
    credits = TitleCreditSerializer(many=True, read_only=True)
    watch_providers = TitleWatchProviderSerializer(many=True, read_only=True)
    news_items = TitleNewsItemSerializer(many=True, read_only=True)
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
            "status",
            "overview",
            "tagline",
            "original_language",
            "country_codes",
            "poster_url",
            "backdrop_url",
            "release_date",
            "first_air_date",
            "last_air_date",
            "runtime_minutes",
            "episode_run_times",
            "episode_duration_display",
            "seasons_count",
            "episodes_count",
            "age_rating",
            "popularity",
            "vote_average",
            "vote_count",
            "is_adult",
            "genres",
            "keywords",
            "themes",
            "credits",
            "watch_providers",
            "news_items",
            "created_at",
            "updated_at",
        ]

    def get_episode_duration_display(self, obj):
        runtimes = [rt for rt in obj.episode_run_times if isinstance(rt, int) and rt > 0]
        if not runtimes:
            return None
        if len(set(runtimes)) == 1:
            return f"{runtimes[0]} min"
        return f"{min(runtimes)}–{max(runtimes)} min"
    

