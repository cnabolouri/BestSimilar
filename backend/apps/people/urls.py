from django.urls import path

from apps.people.views import PersonListAPIView, PersonDetailAPIView

urlpatterns = [
    path("", PersonListAPIView.as_view(), name="person-list"),
    path("<slug:slug>/", PersonDetailAPIView.as_view(), name="person-detail"),
]