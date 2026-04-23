from django.contrib import admin
from .models import Genre, Keyword, Theme


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("id", "tmdb_id", "name", "category")
    search_fields = ("name", "tmdb_id")
    list_filter = ("category",)


@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):
    list_display = ("id", "tmdb_id", "name")
    search_fields = ("name", "tmdb_id")


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "type")
    search_fields = ("name",)
    list_filter = ("type",)