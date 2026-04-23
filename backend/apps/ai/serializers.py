from rest_framework import serializers


class DiscoverRequestSerializer(serializers.Serializer):
    prompt = serializers.CharField()
    media_type = serializers.ChoiceField(
        choices=["movie", "tv"],
        required=False
    )
    limit = serializers.IntegerField(required=False, min_value=1, max_value=50, default=10)