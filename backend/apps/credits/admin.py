from django.contrib import admin
from .models import TitleCredit


@admin.register(TitleCredit)
class TitleCreditAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "person", "role_type", "character_name", "job_name", "billing_order")
    search_fields = ("title__name", "person__name", "character_name", "job_name")
    list_filter = ("role_type",)