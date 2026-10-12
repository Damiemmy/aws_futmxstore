from rest_framework.permissions import BasePermission


class CanUploadMaterial(BasePermission):

    message = "You do not have permission to upload materials."

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return request.user.user_roles.filter(
            role__name__in=["Course Representative", "Lecturer", "Admin","Customer"],
            is_active=True,
            is_approved=True,
        ).exists()
# class CanUploadMaterial(BasePermission):
#     message = "Authentication is required to contribute."

#     def has_permission(self, request, view):
#         return bool(request.user and request.user.is_authenticated)


class CanReviewAcademicContent(BasePermission):
    message = "You are not authorized to review academic content."

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_staff:
            return True

        return user.user_roles.filter(
            role__name__in=["Admin", "Lecturer","Course Representative"],
            is_active=True,
            is_approved=True,
        ).exists()