from django.contrib import admin
from .models import Title


@admin.register(Title)
class TitleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "media_type",
        "tmdb_id",
        "release_date",
        "first_air_date",
        "vote_average",
        "popularity",
    )
    search_fields = ("name", "original_name", "tmdb_id", "slug")
    list_filter = ("media_type", "original_language", "is_adult")
    filter_horizontal = ("genres", "keywords", "themes")