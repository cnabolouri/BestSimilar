from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from apps.accounts.models import (
    UserPrivacySettings,
    UserProfile,
    UserSiteSettings,
    UserTastePreferences,
)

User = get_user_model()

RESERVED_USERNAMES = {
    "profile",
    "settings",
    "watchlist",
    "favorites",
    "history",
    "ratings",
    "reviews",
    "admin",
    "api",
    "login",
    "logout",
    "signup",
    "me",
}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value):
        if value.lower() in RESERVED_USERNAMES:
            raise serializers.ValidationError("This username is reserved.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs["username"],
            password=attrs["password"],
        )

        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        attrs["user"] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "display_name",
            "username",
            "username_slug",
            "email",
            "bio",
            "avatar_url",
            "date_joined",
        ]

    def validate_username_slug(self, value):
        if value.lower() in RESERVED_USERNAMES:
            raise serializers.ValidationError("This username is reserved.")
        return value


class PublicUserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    member_since = serializers.DateTimeField(source="user.date_joined", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "display_name",
            "username",
            "username_slug",
            "bio",
            "avatar_url",
            "member_since",
        ]


class UserPrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPrivacySettings
        fields = [
            "show_ratings",
            "show_watchlist",
            "show_favorite_titles",
            "show_favorite_people",
            "show_reviews",
            "show_watch_history",
        ]


class UserSiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSiteSettings
        fields = [
            "theme",
            "compact_cards",
            "autoplay_trailers",
            "reduce_animations",
        ]


class UserTastePreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTastePreferences
        fields = [
            "preferred_format",
            "content_rating_preference",
            "favorite_genres",
            "preferred_languages",
            "preferred_countries",
            "preferred_providers",
            "avoided_genres",
        ]
