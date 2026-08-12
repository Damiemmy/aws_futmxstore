from django.urls import path
from .views import (
    FacultyListView,
    DepartmentListView,
    LevelListView,
    SemesterListView,
    CourseListView,
    MaterialCreateView
)

urlpatterns = [
    path("faculties/",FacultyListView.as_view(),name="faculty-list",),
    path("departments/",DepartmentListView.as_view(),name="department-list",),
    path("levels/",LevelListView.as_view(),name='level-list'),
    path("semesters/",SemesterListView.as_view(),name='semester-list'),
    path("courses/",CourseListView.as_view(),name='course-list'),
    path("materials/",MaterialCreateView.as_view(),name="material-create",),
]