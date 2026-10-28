from django.contrib.auth import get_user_model
from apps.authentication.models import UserRole
from .models import Activity

#academics
from django.db.models import Count, Q
from django.utils import timezone

from apps.academics.models import (
    Faculty,
    Department,
    Programme,
    Level,
    AcademicSession,
    Semester,
    Course,
    CourseOffering,
    Material,
    CourseRequest,
    MaterialRequest,
    MaterialDownload,
)

User = get_user_model()


def get_total_user_count():
    """Return the total number of registered user accounts."""
    return User.objects.count()


def get_active_user_count():
    """Return the number of user accounts marked as active."""
    return User.objects.filter(is_active=True).count()

def get_active_user_role_count():
    return User.objects.fileter(user_role__is_active=True)

def get_verified_user_count():
    """Return the number of verified user accounts."""
    return User.objects.filter(is_verified=True).count()

def get_active_role_assignment_count():
    """Return the number of active role assignments."""
    return UserRole.objects.filter(is_active=True).count()

def get_approved_role_assignment_count():
    """Return the number of approved role assignments."""
    return UserRole.objects.filter(is_approved=True).count()


def get_users_with_active_roles_count():
    """Return the number of distinct users with active role assignments."""
    return User.objects.filter(
        user_roles__is_active=True
    ).distinct().count()


#acadmics



# ==========================================================
# 1. DASHBOARD SUMMARY COUNTS
# ==========================================================

def get_total_faculty_count():
    return Faculty.objects.count()


def get_total_department_count():
    return Department.objects.count()


def get_total_programme_count():
    return Programme.objects.count()


def get_total_level_count():
    return Level.objects.count()


def get_total_semester_count():
    return Semester.objects.count()


def get_total_course_count():
    return Course.objects.count()


def get_total_course_offering_count():
    return CourseOffering.objects.count()


def get_total_material_count():
    return Material.objects.count()


def get_total_academic_session_count():
    return AcademicSession.objects.count()


# ==========================================================
# 2. ACADEMIC SESSION QUERIES
# ==========================================================

def get_active_academic_session():
    """
    Return the active academic session, or None if none exists.

    Assumes your application maintains at most one active session.
    """
    return AcademicSession.objects.filter(is_active=True).first()


def get_academic_sessions_queryset():
    return AcademicSession.objects.all()


def get_course_offerings_for_active_session():
    """
    Return offerings belonging to the active academic session.
    Return an empty queryset when no session is active.
    """
    return CourseOffering.objects.filter(
        academic_session__is_active=True
    ).select_related(
        "academic_session",
        "course",
        "course__semester",
        "course__semester__level",
    )


def get_materials_for_active_session():
    """
    Return materials attached to offerings in the active session.
    Materials without a course offering are excluded.
    """
    return Material.objects.filter(
        course_offering__academic_session__is_active=True
    ).select_related(
        "course",
        "course_offering",
        "course_offering__academic_session",
        "uploaded_by",
    )


# ==========================================================
# 3. COURSE APPROVAL METRICS
# ==========================================================

def get_pending_course_count():
    return Course.objects.filter(
        status=Course.Status.PENDING
    ).count()


def get_approved_course_count():
    return Course.objects.filter(
        status=Course.Status.APPROVED
    ).count()


def get_rejected_course_count():
    return Course.objects.filter(
        status=Course.Status.REJECTED
    ).count()


def get_course_status_counts():
    """
    Return all course approval counts in one database query.
    """
    return Course.objects.aggregate(
        total=Count("id"),
        pending=Count(
            "id",
            filter=Q(status=Course.Status.PENDING),
        ),
        approved=Count(
            "id",
            filter=Q(status=Course.Status.APPROVED),
        ),
        rejected=Count(
            "id",
            filter=Q(status=Course.Status.REJECTED),
        ),
    )


# ==========================================================
# 4. MATERIAL APPROVAL METRICS
# ==========================================================

def get_pending_material_count():
    return Material.objects.filter(
        status=Material.Status.PENDING
    ).count()


def get_approved_material_count():
    return Material.objects.filter(
        status=Material.Status.APPROVED
    ).count()


def get_rejected_material_count():
    return Material.objects.filter(
        status=Material.Status.REJECTED
    ).count()


def get_material_status_counts():
    """
    Return all material approval counts in one database query.
    """
    return Material.objects.aggregate(
        total=Count("id"),
        pending=Count(
            "id",
            filter=Q(status=Material.Status.PENDING),
        ),
        approved=Count(
            "id",
            filter=Q(status=Material.Status.APPROVED),
        ),
        rejected=Count(
            "id",
            filter=Q(status=Material.Status.REJECTED),
        ),
    )


# ==========================================================
# 5. APPROVAL QUEUES
# ==========================================================

def get_pending_course_requests_queryset():
    return CourseRequest.objects.filter(
        status=Course.Status.PENDING
    ).select_related(
        "semester",
        "semester__level",
        "semester__level__department",
        "reviewed_by",
    ).order_by("pk")


def get_pending_material_requests_queryset():
    return MaterialRequest.objects.filter(
        status=Material.Status.PENDING
    ).select_related(
        "course",
        "course__semester",
        "course__semester__level",
        "course_offering",
        "course_offering__academic_session",
        "uploaded_by",
        "reviewed_by",
    ).order_by("created_at")


def get_recent_course_requests_queryset(limit=10):
    return CourseRequest.objects.select_related(
        "semester",
        "semester__level",
        "reviewed_by",
    ).order_by("-pk")[:limit]


def get_recent_material_requests_queryset(limit=10):
    return MaterialRequest.objects.select_related(
        "course",
        "course_offering",
        "course_offering__academic_session",
        "uploaded_by",
        "reviewed_by",
    ).order_by("-created_at")[:limit]


# ==========================================================
# 6. ACADEMIC RECORD RETRIEVAL
# ==========================================================

def get_faculties_queryset():
    return Faculty.objects.all().order_by("name")


def get_departments_queryset():
    return Department.objects.select_related(
        "faculty"
    ).order_by("name")


def get_programmes_queryset():
    return Programme.objects.select_related(
        "department",
        "department__faculty",
    ).order_by("name")


def get_levels_queryset():
    return Level.objects.select_related(
        "department",
        "department__faculty",
        "programme",
    ).order_by("name")


def get_semesters_queryset():
    return Semester.objects.select_related(
        "level",
        "level__department",
        "level__programme",
    ).order_by("name")


def get_courses_queryset():
    return Course.objects.select_related(
        "semester",
        "semester__level",
        "semester__level__department",
        "semester__level__department__faculty",
        "semester__level__programme",
    ).order_by("code")


def get_course_offerings_queryset():
    return CourseOffering.objects.select_related(
        "course",
        "course__semester",
        "course__semester__level",
        "academic_session",
    ).order_by("-academic_session__start_year", "course__code")


def get_materials_queryset():
    return Material.objects.select_related(
        "course",
        "course__semester",
        "course__semester__level",
        "course_offering",
        "course_offering__academic_session",
        "uploaded_by",
        "reviewed_by",
    ).order_by("-created_at")


# ==========================================================
# 7. FILTER RECORDS BY ACADEMIC CONTEXT
# ==========================================================

def get_departments_by_faculty(faculty_id):
    return Department.objects.filter(
        faculty_id=faculty_id
    ).order_by("name")


def get_programmes_by_department(department_id):
    return Programme.objects.filter(
        department_id=department_id
    ).order_by("name")


def get_levels_by_department(department_id):
    return Level.objects.filter(
        department_id=department_id
    ).select_related(
        "programme"
    ).order_by("name")


def get_semesters_by_level(level_id):
    return Semester.objects.filter(
        level_id=level_id
    ).order_by("name")


def get_courses_by_semester(semester_id):
    return Course.objects.filter(
        semester_id=semester_id
    ).select_related(
        "semester",
        "semester__level",
    ).order_by("code")


def get_course_offerings_by_session(academic_session_id):
    return CourseOffering.objects.filter(
        academic_session_id=academic_session_id
    ).select_related(
        "course",
        "academic_session",
        "course__semester",
    ).order_by("course__code")


def get_materials_by_course(course_id):
    return Material.objects.filter(
        course_id=course_id
    ).select_related(
        "course",
        "course_offering",
        "course_offering__academic_session",
        "uploaded_by",
    ).order_by("-created_at")


def get_materials_by_session(academic_session_id):
    return Material.objects.filter(
        course_offering__academic_session_id=academic_session_id
    ).select_related(
        "course",
        "course_offering",
        "course_offering__academic_session",
        "uploaded_by",
    ).order_by("-created_at")


def get_courses_by_status(status):
    valid_statuses = Course.Status.values

    if status not in valid_statuses:
        return Course.objects.none()

    return Course.objects.filter(
        status=status
    ).select_related(
        "semester",
        "semester__level",
        "reviewed_by",
    )


def get_materials_by_status(status):
    valid_statuses = Material.Status.values

    if status not in valid_statuses:
        return Material.objects.none()

    return Material.objects.filter(
        status=status
    ).select_related(
        "course",
        "course_offering",
        "uploaded_by",
        "reviewed_by",
    )


# ==========================================================
# 8. RECENT ACADEMIC ACTIVITY
# ==========================================================

def get_recent_materials_queryset(limit=10):
    return Material.objects.select_related(
        "course",
        "course_offering",
        "course_offering__academic_session",
        "uploaded_by",
    ).order_by("-created_at")[:limit]


def get_recently_reviewed_courses_queryset(limit=10):
    return Course.objects.filter(
        reviewed_at__isnull=False
    ).select_related(
        "reviewed_by",
        "semester",
    ).order_by("-reviewed_at")[:limit]


def get_recently_reviewed_materials_queryset(limit=10):
    return Material.objects.filter(
        reviewed_at__isnull=False
    ).select_related(
        "reviewed_by",
        "course",
    ).order_by("-reviewed_at")[:limit]




#Activity session


def get_total_activity_count():
    return Activity.objects.count()


def get_activity_count_today():
    today = timezone.localdate()

    return Activity.objects.filter(
        created_at__date=today
    ).count()


def get_recent_activities(*, limit=20):
    return (
        Activity.objects
        .select_related("actor")
        .order_by("-created_at")[:limit]
    )


def get_activity_counts_by_action():
    return (
        Activity.objects
        .values("action")
        .annotate(total=Count("id"))
        .order_by("-total")
    )


def get_activity_counts_today_by_action():
    today = timezone.localdate()

    return (
        Activity.objects
        .filter(created_at__date=today)
        .values("action")
        .annotate(total=Count("id"))
        .order_by("-total")
    )


def get_platform_activity_summary():
    today = timezone.localdate()

    return Activity.objects.aggregate(
        total=Count("id"),
        today=Count(
            "id",
            filter=Q(created_at__date=today),
        ),
    )


def get_download_summary():
    today = timezone.localdate()

    return MaterialDownload.objects.aggregate(
        total=Count("id"),
        today=Count(
            "id",
            filter=Q(downloaded_at__date=today),
        ),
    )





#Data Analytics:


from datetime import datetime, time, timedelta
from django.db.models.functions import TruncDate

def _get_analytics_window(days=30):
    """
    Return a local-date window and timezone-aware datetime boundaries.
    The window includes today and the preceding days - 1 days.
    """
    days = max(1, min(int(days), 90))

    today = timezone.localdate()
    start_date = today - timedelta(days=days - 1)
    end_date = today + timedelta(days=1)

    current_tz = timezone.get_current_timezone()

    start_datetime = timezone.make_aware(
        datetime.combine(start_date, time.min),
        current_tz,
    )
    end_datetime = timezone.make_aware(
        datetime.combine(end_date, time.min),
        current_tz,
    )

    return start_date, today, start_datetime, end_datetime, current_tz


def _fill_daily_series(start_date, end_date, rows, value_fields):
    """
    Fill missing dates with zero so charts have a continuous timeline.
    """
    indexed_rows = {
        row["day"].isoformat(): row
        for row in rows
    }

    result = []
    current_date = start_date

    while current_date <= end_date:
        date_key = current_date.isoformat()
        row = indexed_rows.get(date_key, {})

        point = {"date": date_key}

        for field in value_fields:
            point[field] = row.get(field, 0)

        result.append(point)
        current_date += timedelta(days=1)

    return result


def get_downloads_per_day(*, days=30):
    """
    Count recorded material download events per day.
    """
    (
        start_date,
        today,
        start_datetime,
        end_datetime,
        current_tz,
    ) = _get_analytics_window(days)

    rows = (
        MaterialDownload.objects
        .filter(
            downloaded_at__gte=start_datetime,
            downloaded_at__lt=end_datetime,
        )
        .annotate(
            day=TruncDate("downloaded_at", tzinfo=current_tz)
        )
        .values("day")
        .annotate(downloads=Count("id"))
        .order_by("day")
    )

    return _fill_daily_series(
        start_date,
        today,
        rows,
        ["downloads"],
    )


def get_popular_courses(*, days=30, limit=10):
    """
    Rank approved courses by recorded downloads of their materials
    during the selected period.
    """
    (
        _start_date,
        _today,
        start_datetime,
        end_datetime,
        _current_tz,
    ) = _get_analytics_window(days)

    limit = max(1, min(int(limit), 20))

    rows = (
        MaterialDownload.objects
        .filter(
            downloaded_at__gte=start_datetime,
            downloaded_at__lt=end_datetime,
            material__status=Material.Status.APPROVED,
            material__course__status=Course.Status.APPROVED
        )
        .values(
            "material__course_id",
            "material__course__code",
            "material__course__title",
        )
        .annotate(downloads=Count("id"))
        .order_by("-downloads", "material__course__title")[:limit]
    )

    return [
        {
            "course_id": row["material__course_id"],
            "course_code": row["material__course__code"],
            "course_title": row["material__course__title"],
            "downloads": row["downloads"],
        }
        for row in rows
    ]


def get_engagement_per_day(*, days=30):
    """
    Count distinct users and recorded activity events per day.

    This measures recorded platform engagement, not necessarily
    every visit or every student interaction.
    """
    (
        start_date,
        today,
        start_datetime,
        end_datetime,
        current_tz,
    ) = _get_analytics_window(days)

    rows = (
        Activity.objects
        .filter(
            created_at__gte=start_datetime,
            created_at__lt=end_datetime,
            actor__isnull=False,
        )
        .annotate(
            day=TruncDate("created_at", tzinfo=current_tz)
        )
        .values("day")
        .annotate(
            active_users=Count("actor", distinct=True),
            actions=Count("id"),
        )
        .order_by("day")
    )

    return _fill_daily_series(
        start_date,
        today,
        rows,
        ["active_users", "actions"],
    )
