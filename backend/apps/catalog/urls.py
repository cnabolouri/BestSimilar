from django.urls import path

from apps.catalog.views import TitleListAPIView, TitleDetailAPIView

urlpatterns = [
    path("titles/", TitleListAPIView.as_view(), name="title-list"),
    path("titles/<slug:slug>/", TitleDetailAPIView.as_view(), name="title-detail"),
]