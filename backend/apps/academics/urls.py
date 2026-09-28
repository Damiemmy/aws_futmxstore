from django.urls import path
from .views import (
    FacultyListView,
    DepartmentListView,
    ProgrammeListView,
    AcademicSessionListView,
    CourseOfferingListView,
    LevelListView,
    SemesterListView,
    CourseListView,
    MaterialCreateView,
    MaterialListView,
    MaterialDetailView,
    MaterialDownloadView,
    CourseCreateView
)

urlpatterns = [
    path("faculties/",FacultyListView.as_view(),name="faculty-list",),
    path("departments/",DepartmentListView.as_view(),name="department-list",),
    path("programmes/", ProgrammeListView.as_view(), name="programme-list"),
    path("sessions/",AcademicSessionListView.as_view(),name="academic-session-list",),
    path("levels/",LevelListView.as_view(),name='level-list'),
    path("semesters/",SemesterListView.as_view(),name='semester-list'),
    path("courses/",CourseListView.as_view(),name='course-list'),
    path("materials/create/",MaterialCreateView.as_view(),name="material-create",),
    path("materials/",MaterialListView.as_view(),name="material-list",),
    path("materials/<int:pk>/",MaterialDetailView.as_view(),name="material-detail",),
    path("materials/<int:pk>/download/",MaterialDownloadView.as_view(),name="material-download",),
    path("course-offerings/",CourseOfferingListView.as_view(),name="course-offering-list",),
    path("courses/create/",CourseCreateView.as_view(),name="course-create",),
    
]