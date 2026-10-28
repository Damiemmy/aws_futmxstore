from apps.academics import selectors as academic_selectors
from . import selectors as dashboard_selectors
from .models import Activity



def get_academic_dashboard_summary():
    return {
        "faculties": academic_selectors.get_total_faculty_count(),
        "departments": academic_selectors.get_total_department_count(),
        "programmes": academic_selectors.get_total_programme_count(),
        "levels": academic_selectors.get_total_level_count(),
        "semesters": academic_selectors.get_total_semester_count(),
        "courses": academic_selectors.get_total_course_count(),
        "course_offerings": (
            academic_selectors.get_total_course_offering_count()
        ),
        "materials": academic_selectors.get_total_material_count(),
        "pending_courses": (
            academic_selectors.get_pending_course_count()
        ),
        "pending_materials": (
            academic_selectors.get_pending_material_count()
        ),
        "course_status": (
            academic_selectors.get_course_status_counts()
        ),
        "material_status": (
            academic_selectors.get_material_status_counts()
        ),
        "downloads": dashboard_selectors.get_download_summary(),
        "activity": dashboard_selectors.get_platform_activity_summary(),
    }



def log_activity(
    *,
    action,
    description,
    actor=None,
    target_type="",
    target_id="",
    metadata=None,
):
    """
    Record one platform activity event.
    Call this explicitly after a meaningful action succeeds.
    """
    return Activity.objects.create(
        action=action,
        description=description,
        actor=actor,
        target_type=target_type,
        target_id=str(target_id) if target_id is not None else "",
        metadata=metadata or {},
    )
