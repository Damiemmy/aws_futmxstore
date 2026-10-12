from django.shortcuts import render
from rest_framework.generics import ListAPIView,CreateAPIView
from .models import Course,Material
from rest_framework.views import APIView
from .serializers import (
    FacultySerializer,
    DepartmentSerializer,
    ProgrammeSerializer,
    AcademicSessionSerializer,
    CourseOfferingSerializer,
    LevelSerializer,
    SemesterSerializer,
    CourseSerializer,
    MaterialSerializer,

)

from .selectors import (
    get_faculties,
    get_departments,
    get_programmes,
    get_academic_sessions,
    get_course_offerings,
    get_levels,
    get_semesters,
    get_courses,
    get_materials,
    get_courses_for_material_upload,
    get_pending_courses,
    get_pending_materials,
)
from .services import (
    create_material,
    create_course,
    download_material,
    approve_course,
    reject_course,
    approve_material,
    reject_material,
)

from rest_framework.permissions import IsAuthenticated,AllowAny
from .permissions import CanReviewAcademicContent, CanUploadMaterial


from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import NotFound

from .selectors import get_material

from rest_framework.response import Response
from rest_framework import status
from .pagination import MaterialPagination


class FacultyListView(ListAPIView):

    serializer_class = FacultySerializer

    def get_queryset(self):
        return get_faculties()


class DepartmentListView(ListAPIView):

    serializer_class = DepartmentSerializer

    def get_queryset(self):
        return get_departments()


class ProgrammeListView(ListAPIView):

    serializer_class = ProgrammeSerializer

    def get_queryset(self):
        return get_programmes()


class AcademicSessionListView(ListAPIView):

    serializer_class = AcademicSessionSerializer

    def get_queryset(self):
        return get_academic_sessions()


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
class CourseCreateView(CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        course = create_course(
            code=serializer.validated_data["code"],
            title=serializer.validated_data["title"],
            unit=serializer.validated_data["unit"],
            semester=serializer.validated_data["semester"],
        )

        serializer.instance = course

class MaterialCreateView(CreateAPIView):

    serializer_class = MaterialSerializer

    permission_classes = [
        IsAuthenticated,
        CanUploadMaterial,
    ]

    def perform_create(self, serializer):
        material = create_material(
            course=serializer.validated_data["course"],
            academic_session=serializer.validated_data["academic_session"],
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
    pagination_class = MaterialPagination

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

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        material = get_material(
            material_id=pk
        )

        if material is None:
            raise NotFound("Material not found.")

        return download_material(material)


class CourseOfferingListView(ListAPIView):

    serializer_class = CourseOfferingSerializer

    def get_queryset(self):
        return get_course_offerings()

class CourseUploadOptionsView(ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_courses_for_material_upload()


class PendingCourseListView(ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [
        IsAuthenticated,
        CanReviewAcademicContent,
    ]

    def get_queryset(self):
        return get_pending_courses()


class PendingMaterialListView(ListAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [
        IsAuthenticated,
        CanReviewAcademicContent,
    ]

    def get_queryset(self):
        return get_pending_materials()

class ReviewActionView(APIView):
    permission_classes = [
        IsAuthenticated,
        CanReviewAcademicContent,
    ]

    model = None
    approve_service = None
    reject_service = None
    id_field = None

    def post(self, request, pk, action):
        if action not in {"approve", "reject"}:
            raise NotFound("Review action not found.")

        if not self.model.objects.filter(pk=pk).exists():
            raise NotFound("Submission not found.")

        if action == "approve":
            result = self.approve_service(
                **{self.id_field: pk},
                reviewer=request.user,
            )
        else:
            reason = request.data.get("rejection_reason", "").strip()

            if not reason:
                raise ValidationError({
                    "rejection_reason": "A rejection reason is required."
                })

            result = self.reject_service(
                **{self.id_field: pk},
                reviewer=request.user,
                reason=reason,
            )

        return Response({
            "detail": f"Submission {result.status}.",
            "id": result.pk,
            "status": result.status,
        }, status=status.HTTP_200_OK)

class CourseReviewView(ReviewActionView):
    model = Course
    approve_service = staticmethod(approve_course)
    reject_service = staticmethod(reject_course)
    id_field = "course_id"


class MaterialReviewView(ReviewActionView):
    model = Material
    approve_service = staticmethod(approve_material)
    reject_service = staticmethod(reject_material)
    id_field = "material_id"