from django.urls import path

from apps.recommendations.views import SimilarTitlesAPIView
from apps.recommendations.views_personalized import PersonalizedRecommendationsView

urlpatterns = [
    path("titles/<slug:slug>/similar/", SimilarTitlesAPIView.as_view(), name="similar-titles"),
    path("personalized/", PersonalizedRecommendationsView.as_view(), name="personalized-recommendations"),
]