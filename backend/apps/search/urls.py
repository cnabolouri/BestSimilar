from django.urls import path

from apps.search.views import UnifiedSearchAPIView

urlpatterns = [
    path("", UnifiedSearchAPIView.as_view(), name="unified-search"),
]