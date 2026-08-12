from rest_framework.permissions import BasePermission


class CanUploadMaterial(BasePermission):
    message = "You do not have permission to upload materials."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.user_roles.filter(
            role__name__in=["Course Rep", "Lecturer"],
            is_active=True,
            is_approved=True,
        ).exists()