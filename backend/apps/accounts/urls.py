from django.urls import path

from apps.accounts.views import (
    ChangePasswordAPIView,
    LoginAPIView,
    LogoutAPIView,
    MeAPIView,
    PrivacySettingsAPIView,
    ProfileAPIView,
    ProfileSummaryAPIView,
    PublicProfileAPIView,
    PublicProfileOverviewAPIView,
    PublicProfileSearchAPIView,
    PublicProfileSummaryAPIView,
    SecurityAPIView,
    SignupAPIView,
    SiteSettingsAPIView,
    TastePreferencesAPIView,
)
from apps.accounts.views_google import GoogleLoginCompleteView, GoogleLoginRedirectView

urlpatterns = [
    path("me/", MeAPIView.as_view(), name="auth-me"),
    path("profile/", ProfileAPIView.as_view(), name="auth-profile"),
    path("profile/summary/", ProfileSummaryAPIView.as_view(), name="auth-profile-summary"),
    path("profile/privacy/", PrivacySettingsAPIView.as_view(), name="auth-profile-privacy"),
    path("profile/security/", SecurityAPIView.as_view(), name="auth-profile-security"),
    path("profile/change-password/", ChangePasswordAPIView.as_view(), name="auth-profile-change-password"),
    path("profile/site-settings/", SiteSettingsAPIView.as_view(), name="auth-profile-site-settings"),
    path("profile/preferences/", TastePreferencesAPIView.as_view(), name="auth-profile-preferences"),
    path("profiles/search/", PublicProfileSearchAPIView.as_view(), name="public-profile-search"),
    path("profiles/<slug:username>/", PublicProfileAPIView.as_view(), name="public-profile"),
    path("profiles/<slug:username>/summary/", PublicProfileSummaryAPIView.as_view(), name="public-profile-summary"),
    path("profiles/<slug:username>/overview/", PublicProfileOverviewAPIView.as_view(), name="public-profile-overview"),
    path("signup/", SignupAPIView.as_view(), name="auth-signup"),
    path("login/", LoginAPIView.as_view(), name="auth-login"),
    path("logout/", LogoutAPIView.as_view(), name="auth-logout"),
    path("google/", GoogleLoginRedirectView.as_view(), name="google-login"),
    path("google/complete/", GoogleLoginCompleteView.as_view(), name="google-login-complete"),
]
