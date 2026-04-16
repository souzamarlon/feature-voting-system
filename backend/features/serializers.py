from rest_framework import serializers

from .models import Feature


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ["id", "title", "description", "votes", "created_at"]
        read_only_fields = ["id", "votes", "created_at"]
