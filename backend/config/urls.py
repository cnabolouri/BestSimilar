from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/ai/", include("apps.ai.urls")),
    path("api/v1/catalog/", include("apps.catalog.urls")),
    path("api/v1/people/", include("apps.people.urls")),
    path("api/v1/search/", include("apps.search.urls")),
    path("api/v1/recommendations/", include("apps.recommendations.urls")),
    path("api/v1/interactions/", include("apps.interactions.urls")),
    path("api/v1/comments/", include("apps.comments.urls")),
    path("api/v1/analytics/", include("apps.analytics.urls")),
]