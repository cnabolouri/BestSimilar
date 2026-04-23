from django.urls import path

from apps.recommendations.views import SimilarTitlesAPIView

urlpatterns = [
    path("titles/<slug:slug>/similar/", SimilarTitlesAPIView.as_view(), name="similar-titles"),
]