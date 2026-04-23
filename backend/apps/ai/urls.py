from django.urls import path

from apps.ai.views import DiscoverAPIView

urlpatterns = [
    path("discover/", DiscoverAPIView.as_view(), name="discover"),
]