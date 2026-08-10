from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .serializers import (
    FacultySerializer,
    DepartmentSerializer,
    LevelSerializer,
    SemesterSerializer,
    CourseSerializer,
)

from .selectors import get_faculties,get_departments,get_levels,get_semesters,get_courses


class FacultyListView(ListAPIView):

    serializer_class = FacultySerializer

    def get_queryset(self):
        return get_faculties()


class DepartmentListView(ListAPIView):

    serializer_class = DepartmentSerializer

    def get_queryset(self):
        return get_departments()

class LevelListView(ListAPIView):
    serializer_class=LevelSerializer

    def get_queryset(self):
        return(
            get_levels()
        )


class SemesterListView(ListAPIView):
    serializer_class=SemesterSerializer

    def get_queryset(self):
        return(
            get_semesters()
        )

class CourseListView(ListAPIView):
    serializer_class=CourseSerializer

    def get_queryset(self):
        return(
            get_courses()
        )
        