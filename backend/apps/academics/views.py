from django.shortcuts import render
from rest_framework.generics import ListAPIView,CreateAPIView
from .serializers import (
    FacultySerializer,
    DepartmentSerializer,
    LevelSerializer,
    SemesterSerializer,
    CourseSerializer,
    MaterialSerializer,
)

from .selectors import get_faculties,get_departments,get_levels,get_semesters,get_courses
from .services import create_material
from rest_framework.permissions import IsAuthenticated
from .models import Material
from .permissions import CanUploadMaterial




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


class MaterialCreateView(CreateAPIView):

    serializer_class = MaterialSerializer

    permission_classes = [
        IsAuthenticated,
        CanUploadMaterial,
    ]

    def perform_create(self, serializer):
        create_material(
            course=serializer.validated_data["course"],
            title=serializer.validated_data["title"],
            description=serializer.validated_data.get("description", ""),
            file=serializer.validated_data["file"],
            uploaded_by=self.request.user,
        )