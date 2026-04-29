from django.conf import settings
from django.shortcuts import redirect
from django.views import View


def clean_next_url(next_url: str | None) -> str:
    """Only allow relative paths to prevent open redirect attacks."""
    if not next_url:
        return "/profile"
    if not next_url.startswith("/"):
        return "/profile"
    if next_url.startswith("//"):
        return "/profile"
    return next_url


class GoogleLoginRedirectView(View):
    """
    Entry point: /api/v1/auth/google/?next=/profile/bolfsina
    Stores the next URL in session, then hands off to allauth's Google login.
    """

    def get(self, request):
        next_url = clean_next_url(request.GET.get("next"))
        request.session["post_auth_redirect"] = next_url
        return redirect("/accounts/google/login/")


class GoogleLoginCompleteView(View):
    """
    Called after allauth completes the OAuth flow (LOGIN_REDIRECT_URL).
    Reads the stored next URL and redirects the browser to the frontend.
    """

    def get(self, request):
        next_url = clean_next_url(
            request.session.pop("post_auth_redirect", "/profile")
        )
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
        return redirect(f"{frontend_url}{next_url}")
