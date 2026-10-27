from django.db import models

# Create your models here.

from django.conf import settings
from django.db import models


class Activity(models.Model):
    class Action(models.TextChoices):
        MATERIAL_DOWNLOADED = (
            "material_downloaded",
            "Material downloaded",
        )
        MATERIAL_UPLOADED = (
            "material_uploaded",
            "Material uploaded",
        )
        MATERIAL_APPROVED = (
            "material_approved",
            "Material approved",
        )
        MATERIAL_REJECTED = (
            "material_rejected",
            "Material rejected",
        )
        COURSE_SUBMITTED = (
            "course_submitted",
            "Course submitted",
        )
        COURSE_APPROVED = (
            "course_approved",
            "Course approved",
        )
        COURSE_REJECTED = (
            "course_rejected",
            "Course rejected",
        )
        USER_REGISTERED = (
            "user_registered",
            "User registered",
        )
        USER_LOGIN = (
            "user_login",
            "User login",
        )

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="platform_activities",
    )

    action = models.CharField(
        max_length=40,
        choices=Action.choices,
        db_index=True,
    )

    description = models.CharField(max_length=255)

    # Optional reference to the affected object.
    # A text ID avoids assuming that all target models use integer PKs.
    target_type = models.CharField(
        max_length=100,
        blank=True,
    )
    target_id = models.CharField(
        max_length=100,
        blank=True,
    )

    # Store only non-sensitive contextual data.
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["action", "created_at"],
                name="activity_action_date_idx",
            ),
            models.Index(
                fields=["actor", "created_at"],
                name="activity_actor_date_idx",
            ),
        ]

    def __str__(self):
        return f"{self.get_action_display()}: {self.description}"


