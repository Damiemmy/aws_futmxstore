from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import UserManager


class User(AbstractUser):
    """
    Custom User model.

    - Uses email for authentication.
    - Keeps username as an optional display name.
    """

    username = models.CharField(
        max_length=150,
        unique=True,
        blank=True,
        null=True,
        help_text="Optional display username."
    )

    email = models.EmailField(unique=True,)
    is_verified = models.BooleanField(default=False,)

    USERNAME_FIELD = "email"

    # Since email is USERNAME_FIELD,
    # Django will only require email when creating a superuser.
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Role(models.Model):
    """
    System roles.
    Example:
    Student
    Vendor
    Lecturer
    Course Representative
    Admin
    """

    name = models.CharField(max_length=30,unique=True,)

    def __str__(self):
        return self.name


class UserRole(models.Model):
    """
    Junction table between User and Role.
    Allows a user to possess multiple roles.
    """

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_roles",)

    role = models.ForeignKey(Role,on_delete=models.CASCADE,related_name="user_roles",)

    is_approved = models.BooleanField(default=False,)
    is_active = models.BooleanField(default=False,)
    assigned_at = models.DateTimeField(auto_now_add=True,)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "role"],
                name="unique_user_role",
            )
        ]
        ordering = ["-assigned_at"]

    def __str__(self):
        return f"{self.user.email} → {self.role.name}"