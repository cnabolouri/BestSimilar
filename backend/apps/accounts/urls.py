from django.urls import path

from apps.accounts.views import (
    LoginAPIView,
    LogoutAPIView,
    MeAPIView,
    PrivacySettingsAPIView,
    ProfileAPIView,
    ProfileSummaryAPIView,
    PublicProfileAPIView,
    PublicProfileOverviewAPIView,
    PublicProfileSummaryAPIView,
    SignupAPIView,
    SiteSettingsAPIView,
    TastePreferencesAPIView,
)

urlpatterns = [
    path("me/", MeAPIView.as_view(), name="auth-me"),
    path("profile/", ProfileAPIView.as_view(), name="auth-profile"),
    path("profile/summary/", ProfileSummaryAPIView.as_view(), name="auth-profile-summary"),
    path("profile/privacy/", PrivacySettingsAPIView.as_view(), name="auth-profile-privacy"),
    path("profile/site-settings/", SiteSettingsAPIView.as_view(), name="auth-profile-site-settings"),
    path("profile/preferences/", TastePreferencesAPIView.as_view(), name="auth-profile-preferences"),
    path("profiles/<slug:username>/", PublicProfileAPIView.as_view(), name="public-profile"),
    path("profiles/<slug:username>/summary/", PublicProfileSummaryAPIView.as_view(), name="public-profile-summary"),
    path("profiles/<slug:username>/overview/", PublicProfileOverviewAPIView.as_view(), name="public-profile-overview"),
    path("signup/", SignupAPIView.as_view(), name="auth-signup"),
    path("login/", LoginAPIView.as_view(), name="auth-login"),
    path("logout/", LogoutAPIView.as_view(), name="auth-logout"),
]
