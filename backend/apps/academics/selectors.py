from .models import Faculty,Department,Level,Semester,Course,Material
from django.db.models import Q

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

# def get_materials():
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

def get_materials(*, course_id=None, search=None):
    queryset = (
        Material.objects
        .select_related("course", "uploaded_by")
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
    
def get_material(*, material_id):
    return (
        Material.objects
        .select_related("course","uploaded_by")
        .filter(id=material_id)
        .first()
    )