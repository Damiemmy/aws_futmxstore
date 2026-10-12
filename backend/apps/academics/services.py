from .models import Material,CourseOffering,Course
from django.db import transaction
from django.utils import timezone

from django.http import FileResponse

'''
def create_material(
    *,
    course,
    title,
    description,
    file,
    uploaded_by,
):
    return Material.objects.create(
        course=course,
        title=title,
        description=description,
        file=file,
        uploaded_by=uploaded_by,
    )
'''
@transaction.atomic
def create_material(
    *,
    course,
    academic_session,
    title,
    description,
    file,
    uploaded_by,
):
    if course.status == Course.Status.REJECTED:
        raise ValueError(
            "Materials cannot be submitted to a rejected course."
        )
    course_offering, _ = CourseOffering.objects.get_or_create(
        course=course,
        academic_session=academic_session,
    )

    return Material.objects.create(
        course=course,
        course_offering=course_offering,
        title=title,
        description=description,
        file=file,
        uploaded_by=uploaded_by,
        status=Material.Status.PENDING,
    )


@transaction.atomic
def create_course(
    *,
    code,
    title,
    unit,
    semester,
):
    return Course.objects.create(
        code=code,
        title=title,
        unit=unit,
        semester=semester,
        status=Course.Status.PENDING,
    )



def download_material(material):
    return FileResponse(
        material.file.open("rb"),
        as_attachment=True,
        filename=material.file.name.split("/")[-1],
    )


@transaction.atomic
def approve_course(*, course_id, reviewer):
    course = Course.objects.select_for_update().get(pk=course_id)

    if course.status != Course.Status.PENDING:
        raise ValueError("Only pending courses can be approved.")

    course.status = Course.Status.APPROVED
    course.reviewed_by = reviewer
    course.reviewed_at = timezone.now()
    course.rejection_reason = ""
    course.save(
        update_fields=[
            "status",
            "reviewed_by",
            "reviewed_at",
            "rejection_reason",
        ]
    )

    return course


@transaction.atomic
def reject_course(*, course_id, reviewer, reason):
    course = Course.objects.select_for_update().get(pk=course_id)

    if course.status != Course.Status.PENDING:
        raise ValueError("Only pending courses can be rejected.")

    course.status = Course.Status.REJECTED
    course.reviewed_by = reviewer
    course.reviewed_at = timezone.now()
    course.rejection_reason = reason
    course.save(
        update_fields=[
            "status",
            "reviewed_by",
            "reviewed_at",
            "rejection_reason",
        ]
    )

    return course


@transaction.atomic
def approve_material(*, material_id, reviewer):
    material = Material.objects.select_for_update().get(pk=material_id)

    if material.status != Material.Status.PENDING:
        raise ValueError("Only pending materials can be approved.")

    if material.course.status == Course.Status.REJECTED:
        raise ValueError(
            "Materials cannot be approved under a rejected course."
        )

    material.status = Material.Status.APPROVED
    material.reviewed_by = reviewer
    material.reviewed_at = timezone.now()
    material.rejection_reason = ""
    material.save(
        update_fields=[
            "status",
            "reviewed_by",
            "reviewed_at",
            "rejection_reason",
        ]
    )

    return material


@transaction.atomic
def reject_material(*, material_id, reviewer, reason):
    material = Material.objects.select_for_update().get(pk=material_id)

    if material.status != Material.Status.PENDING:
        raise ValueError("Only pending materials can be rejected.")

    material.status = Material.Status.REJECTED
    material.reviewed_by = reviewer
    material.reviewed_at = timezone.now()
    material.rejection_reason = reason
    material.save(
        update_fields=[
            "status",
            "reviewed_by",
            "reviewed_at",
            "rejection_reason",
        ]
    )

    return material