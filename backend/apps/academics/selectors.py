from .models import (
    Faculty,
    Department,
    Programme,
    AcademicSession,
    Level,
    Semester,
    Course,
    Material,
    CourseOffering,
    MaterialDownload,
)
from django.db.models import Count, Q
from django.utils import timezone

def get_faculties():
    return Faculty.objects.all().order_by("name")

def get_departments():
    return (
        Department.objects
        .select_related("faculty")
        .order_by("name")
    )

def get_levels():
    return(
        Level.objects
        .select_related("department","programme")
        .order_by("name")         
    )

def get_semesters():
    return(
        Semester.objects
        .select_related("level")
        .order_by("name")
    )

'''
def get_courses():
    return (
        Course.objects
        .select_related("semester")
        .order_by('title')
    )
'''

def get_courses():
    """Courses approved for public browsing."""
    return (
        Course.objects
        .filter(status=Course.Status.APPROVED)
        .select_related("semester")
        .order_by("title")
    )

#def get_materials():
#     return(    
#         Material.objects
#         .select_related("course","uploaded_by")
#         .order_by("-created_at")
#     )

'''
def get_materials(*, course_id=None):
    queryset = (
        Material.objects
        .select_related("course", "uploaded_by")
        .order_by("-created_at")
    )

    if course_id:
        queryset = queryset.filter(course_id=course_id)

    return queryset
'''

'''previous#def get_materials(*, course_id=None, search=None):
    queryset = (
        Material.objects
        .select_related("course", "course_offering__academic_session", "uploaded_by")
        .order_by("-created_at")
    )

    if course_id:
        queryset = queryset.filter(course_id=course_id)

    if search:
        queryset = queryset.filter(
            Q(title__icontains=search)
            | Q(description__icontains=search)
        )

    return queryset

'''

def get_materials(*, course_id=None, search=None):
    """Only publish approved materials under approved courses."""
    queryset = (
        Material.objects
        .filter(
            status=Material.Status.APPROVED,
            course__status=Course.Status.APPROVED,
        )
        .select_related(
            "course",
            "course__semester",
            "course_offering__academic_session",
            "uploaded_by",
        )
        .order_by("-created_at")
    )

    if course_id:
        queryset = queryset.filter(course_id=course_id)

    if search:
        queryset = queryset.filter(
            Q(title__icontains=search)
            | Q(description__icontains=search)
            | Q(course__code__icontains=search)
            | Q(uploaded_by__username__icontains=search)
        )

    return queryset

'''
def get_material(*, material_id):
    return (
        Material.objects
        .select_related("course","course_offering__academic_session","uploaded_by")
        .filter(id=material_id)
        .first()
    )
'''

'''
def get_material(*, material_id):
    return (
        Material.objects
        .select_related(
            "course",
            "course__semester",
            "course__semester__level",
            "course__semester__level__department",
            "course__semester__level__department__faculty",
            "course__semester__level__programme",
            "course_offering__academic_session",
            "uploaded_by",
        )
        .filter(id=material_id)
        .first()
    )
'''
def get_material(*, material_id):
    return (
        Material.objects
        .filter(
            id=material_id,
            status=Material.Status.APPROVED,
            course__status=Course.Status.APPROVED,
        )
        .select_related(
            "course",
            "course__semester",
            "course__semester__level",
            "course__semester__level__department",
            "course__semester__level__department__faculty",
            "course__semester__level__programme",
            "course_offering__academic_session",
            "uploaded_by",
        )
        .first()
    )
def get_programmes():
    return (
        Programme.objects
        .select_related("department")
        .order_by("name")
    )

def get_academic_sessions():
    return (
        AcademicSession.objects
        .order_by("-start_year")
    )

def get_course_offerings():
    return (
        CourseOffering.objects
        .filter(course__status=Course.Status.APPROVED)
        .select_related(
            "course",
            "academic_session",
        )
        .order_by(
            "-academic_session__start_year",
            "course__code",
        )
    )


def get_pending_materials():
    return (
        Material.objects
        .filter(status=Material.Status.PENDING)
        .select_related(
            "course",
            "course_offering__academic_session",
            "uploaded_by",
        )
        .order_by("-created_at")
    )

def get_pending_courses():
    return (
        Course.objects
        .filter(status=Course.Status.PENDING)
        .select_related("semester")
        .order_by("title")
    )

def get_courses_for_material_upload():
    """
    Pending courses can accept contributions.
    Rejected courses cannot.
    """
    return (
        Course.objects
        .filter(
            status__in=[
                Course.Status.PENDING,
                Course.Status.APPROVED,
            ]
        )
        .select_related("semester")
        .order_by("title")
    )




# Add MaterialDownload to your existing .models import list.


def get_total_download_count():
    return MaterialDownload.objects.count()


def get_downloads_today_count():
    today = timezone.localdate()

    return MaterialDownload.objects.filter(
        downloaded_at__date=today
    ).count()


def get_download_count_for_material(*, material_id):
    return MaterialDownload.objects.filter(
        material_id=material_id
    ).count()


def get_download_count_for_session(*, academic_session_id):
    return MaterialDownload.objects.filter(
        material__course_offering__academic_session_id=academic_session_id
    ).count()


def get_download_counts_by_material():
    return (
        Material.objects
        .annotate(
            download_count=Count("download_events")
        )
        .order_by("-download_count", "title")
    )


def get_most_downloaded_materials(*, limit=10):
    return get_download_counts_by_material()[:limit]


def get_download_activity_counts():
    today = timezone.localdate()

    return MaterialDownload.objects.aggregate(
        total=Count("id"),
        today=Count(
            "id",
            filter=Q(downloaded_at__date=today),
        ),
    )

#Dashboard queries

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


def get_pending_course_count():
    return Course.objects.filter(
        status=Course.Status.PENDING
    ).count()


def get_pending_material_count():
    return Material.objects.filter(
        status=Material.Status.PENDING
    ).count()


def get_course_status_counts():
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


def get_material_status_counts():
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
