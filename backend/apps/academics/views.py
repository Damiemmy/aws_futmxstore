from django.shortcuts import render
from rest_framework.generics import ListAPIView,CreateAPIView
from rest_framework.views import APIView
from .serializers import (
    FacultySerializer,
    DepartmentSerializer,
    LevelSerializer,
    SemesterSerializer,
    CourseSerializer,
    MaterialSerializer,
)

from .selectors import get_faculties,get_departments,get_levels,get_semesters,get_courses,get_materials
from .services import create_material
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Material
from .permissions import CanUploadMaterial


from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import NotFound

from .selectors import get_material

from rest_framework.response import Response
from rest_framework import status
from .services import download_material


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
        material = create_material(
            course=serializer.validated_data["course"],
            title=serializer.validated_data["title"],
            description=serializer.validated_data.get("description", ""),
            file=serializer.validated_data["file"],
            uploaded_by=self.request.user,
        )
        serializer.instance = material

# class MaterialListView(ListAPIView):
#     serializer_class=MaterialSerializer

#     def get_queryset(self):
#         return (
#             get_materials()
#         )

'''
class MaterialListView(ListAPIView):
    serializer_class = MaterialSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get("course")

        return get_materials(
            course_id=course_id,
        )

'''
class MaterialListView(ListAPIView):

    serializer_class = MaterialSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get("course")
        search = self.request.query_params.get("search")

        return get_materials(
            course_id=course_id,
            search=search,
        )

class MaterialDetailView(RetrieveAPIView):

    serializer_class = MaterialSerializer

    def get_object(self):
        material_id = self.kwargs["pk"]

        material = get_material(
            material_id=material_id
        )

        if material is None:
            raise NotFound("Material not found.")

        return material

class MaterialDownloadView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, pk):

        material = get_material(
            material_id=pk
        )

        if material is None:
            raise NotFound("Material not found.")

        return download_material(material)