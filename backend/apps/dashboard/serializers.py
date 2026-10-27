
from rest_framework import serializers

from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    actor_email = serializers.EmailField(
        source="actor.email",
        read_only=True,
        allow_null=True,
    )

    action_label = serializers.CharField(
        source="get_action_display",
        read_only=True,
    )

    class Meta:
        model = Activity
        fields = [
            "id",
            "actor",
            "actor_email",
            "action",
            "action_label",
            "description",
            "target_type",
            "target_id",
            "metadata",
            "created_at",
        ]
        read_only_fields = fields
