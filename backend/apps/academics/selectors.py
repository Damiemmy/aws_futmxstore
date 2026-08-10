from .models import Faculty,Department,Level,Semester,Course

def get_faculties():
    return Faculty.objects.all().order_by("name")

from .models import Department


def get_departments():
    return (
        Department.objects
        .select_related("faculty")
        .order_by("name")
    )

def get_levels():
    return(
        Level.objects
        .select_related("department")
        .order_by("name")         
    )

def get_semesters():
    return(
        Semester.objects
        .select_related("level")
        .order_by("name")
    )

def get_courses():
    return (
        Course.objects
        .select_related("semester")
        .order_by('title')
    )