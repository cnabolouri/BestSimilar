from django.urls import path

from apps.accounts.views import LoginAPIView, LogoutAPIView, MeAPIView, SignupAPIView

urlpatterns = [
    path("me/", MeAPIView.as_view(), name="auth-me"),
    path("signup/", SignupAPIView.as_view(), name="auth-signup"),
    path("login/", LoginAPIView.as_view(), name="auth-login"),
    path("logout/", LogoutAPIView.as_view(), name="auth-logout"),
]