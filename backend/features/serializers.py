from rest_framework import serializers

from .models import Feature


class FeatureSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()

    def get_created_by_username(self, feature: Feature):
        if feature.created_by is None:
            return None

        return feature.created_by.username

    class Meta:
        model = Feature
        fields = [
            "id",
            "title",
            "description",
            "votes",
            "created_at",
            "created_by",
            "created_by_username",
        ]
        read_only_fields = [
            "id",
            "votes",
            "created_at",
            "created_by",
            "created_by_username",
        ]
