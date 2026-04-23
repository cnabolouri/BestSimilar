from django.contrib import admin
from .models import Person


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "tmdb_id", "known_for_department", "popularity")
    search_fields = ("name", "tmdb_id")
    list_filter = ("known_for_department",)