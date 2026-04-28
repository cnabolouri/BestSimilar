from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import Client, TestCase


class DiscoverAPIViewTests(TestCase):
    def test_authenticated_session_post_does_not_require_csrf_token(self):
        user = get_user_model().objects.create_user(
            username="discover-user",
            password="test-password",
        )
        client = Client(enforce_csrf_checks=True)
        client.force_login(user)

        with patch("apps.ai.views.discover_titles_from_prompt", return_value=[]):
            response = client.post(
                "/api/v1/ai/discover/",
                data={"prompt": "moody sci-fi", "media_type": "tv"},
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "prompt": "moody sci-fi",
                "media_type": "tv",
                "count": 0,
                "results": [],
            },
        )
