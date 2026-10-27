from django.contrib import admin
from django.utils import timezone

from .models import (
    Faculty,
    Department,
    Course,
    Semester,
    Level,
    Material,
    Programme,
    AcademicSession,
    CourseOffering,
    CourseRequest,
    MaterialRequest,
)

# Register your models here.

admin.site.register(Faculty)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Semester)
admin.site.register(Level)
admin.site.register(Material)
admin.site.register(AcademicSession)
admin.site.register(Programme)
admin.site.register(CourseOffering)




@admin.register(CourseRequest)
class CourseRequestAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "title",
        "semester",
        "unit",
        "status",
        "reviewed_by",
        "reviewed_at",
    )
    list_filter = ("status", "semester__level__department")
    search_fields = (
        "code",
        "title",
        "semester__name",
        "semester__level__department__name",
    )
    ordering = ("status", "code")

    fields = (
        "code",
        "title",
        "unit",
        "semester",
        "status",
        "rejection_reason",
        "reviewed_by",
        "reviewed_at",
    )
    readonly_fields = ("reviewed_by", "reviewed_at")

    def save_model(self, request, obj, form, change):
        old_status = form.initial.get("status") if change else None

        if obj.status != old_status:
            if obj.status in (
                obj.Status.APPROVED,
                obj.Status.REJECTED,
            ):
                obj.reviewed_by = request.user
                obj.reviewed_at = timezone.now()
            else:
                obj.reviewed_by = None
                obj.reviewed_at = None
                obj.rejection_reason = ""

        super().save_model(request, obj, form, change)


@admin.register(MaterialRequest)
class MaterialRequestAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "course",
        "course_offering",
        "uploaded_by",
        "status",
        "reviewed_by",
        "reviewed_at",
        "created_at",
    )
    list_filter = (
        "status",
        "course__status",
        "course_offering__academic_session",
    )
    search_fields = (
        "title",
        "description",
        "course__code",
        "course__title",
        "uploaded_by__username",
    )
    ordering = ("status", "-created_at")

    fields = (
        "title",
        "description",
        "file",
        "course",
        "course_offering",
        "uploaded_by",
        "status",
        "rejection_reason",
        "reviewed_by",
        "reviewed_at",
        "created_at",
        "updated_at",
    )
    readonly_fields = (
        "uploaded_by",
        "reviewed_by",
        "reviewed_at",
        "created_at",
        "updated_at",
    )

    def save_model(self, request, obj, form, change):
        old_status = form.initial.get("status") if change else None

        if obj.status != old_status:
            if obj.status in (
                obj.Status.APPROVED,
                obj.Status.REJECTED,
            ):
                if (
                    obj.status == obj.Status.APPROVED
                    and obj.course.status == obj.course.Status.REJECTED
                ):
                    from django.core.exceptions import ValidationError

                    raise ValidationError(
                        "Materials cannot be approved under a rejected course."
                    )

                obj.reviewed_by = request.user
                obj.reviewed_at = timezone.now()
            else:
                obj.reviewed_by = None
                obj.reviewed_at = None
                obj.rejection_reason = ""

        super().save_model(request, obj, form, change)



