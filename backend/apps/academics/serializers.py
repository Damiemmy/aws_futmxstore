from rest_framework import serializers
from .models import (
    Faculty,
    Department,
    Programme,
    AcademicSession,
    CourseOffering,
    Level,
    Semester,
    Course,
    Material,
)


class FacultySerializer(serializers.ModelSerializer):

    class Meta:
        model = Faculty
        fields = [
            "id",
            "name",
            "slug",
        ]


class DepartmentSerializer(serializers.ModelSerializer):

    faculty_name = serializers.CharField(
        source="faculty.name",
        read_only=True,
    )

    class Meta:
        model = Department
        fields = [
            "id",
            "name",
            "slug",
            "faculty",
            "faculty_name",
        ]

class LevelSerializer(serializers.ModelSerializer):
    department_name=serializers.CharField(
        source="department.name",
        read_only=True
    )
    programme_name = serializers.CharField(
            source="programme.name",
            read_only=True,
            allow_null=True,
    )

    class Meta:
        model=Level
        fields=[
            "id",
            "name",
            "department",
            "department_name",
            "programme",
            "programme_name",
        ]

class SemesterSerializer(serializers.ModelSerializer):
    level_name=serializers.CharField(
        source="level.name",
        read_only=True
    )

    class Meta:
        model=Semester
        fields=[
            "id",
            "name",
            "level",
            "level_name",
        ]

class CourseSerializer(serializers.ModelSerializer):
    semester_name=serializers.CharField(
        source="semester.name",
        read_only=True
    )

    class Meta:
        model=Course
        fields=[
            "id",
            "code",
            "title",
            "unit",
            "semester",
            "semester_name",
        ]


'''
class MaterialSerializer(serializers.ModelSerializer):

    uploaded_by = serializers.ReadOnlyField(
        source="uploaded_by.id"
    )

    course_code = serializers.CharField(
        source="course.code",
        read_only=True,
    )

    course_offering_session = serializers.CharField(
        source="course_offering.academic_session.name",
        read_only=True,
        allow_null=True,
    )

    academic_session = serializers.PrimaryKeyRelatedField(
        queryset=AcademicSession.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Material

        fields = [
            "id",
            "course",
            "course_code",
            "academic_session",
            "course_offering",
            "course_offering_session",
            "title",
            "description",
            "file",
            "uploaded_by",
            "created_at",
            "updated_at",
            
        ]

        read_only_fields = [
            "id",
            "course_code",
            "course_offering",
            "course_offering_session",
            "uploaded_by",
            "created_at",
            "updated_at",
        ]
'''


class MaterialSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(
        source="uploaded_by.id",
    )

    uploaded_by_username = serializers.CharField(
        source="uploaded_by.username",
        read_only=True,
        allow_null=True,
    )

    course_code = serializers.CharField(
        source="course.code",
        read_only=True,
    )

    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    course_unit = serializers.IntegerField(
        source="course.unit",
        read_only=True,
    )

    semester_name = serializers.CharField(
        source="course.semester.name",
        read_only=True,
    )

    level_name = serializers.CharField(
        source="course.semester.level.name",
        read_only=True,
    )

    department_name = serializers.CharField(
        source="course.semester.level.department.name",
        read_only=True,
    )

    faculty_name = serializers.CharField(
        source="course.semester.level.department.faculty.name",
        read_only=True,
    )

    programme_name = serializers.CharField(
        source="course.semester.level.programme.name",
        read_only=True,
        allow_null=True,
    )

    course_offering_session = serializers.CharField(
        source="course_offering.academic_session.name",
        read_only=True,
        allow_null=True,
    )

    academic_session = serializers.PrimaryKeyRelatedField(
        queryset=AcademicSession.objects.all(),
        write_only=True,
    )

    file_name = serializers.SerializerMethodField()
    file_extension = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()

    class Meta:
        model = Material
        fields = [
            "id",

            # Course
            "course",
            "course_code",
            "course_title",
            "course_unit",

            # Academic hierarchy
            "faculty_name",
            "department_name",
            "programme_name",
            "level_name",
            "semester_name",

            # Session
            "academic_session",
            "course_offering",
            "course_offering_session",

            # Material
            "title",
            "description",
            "file",
            "file_name",
            "file_extension",
            "file_size",

            # Contributor
            "uploaded_by",
            "uploaded_by_username",

            # Dates
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "course_code",
            "course_title",
            "course_unit",
            "faculty_name",
            "department_name",
            "programme_name",
            "level_name",
            "semester_name",
            "course_offering",
            "course_offering_session",
            "file_name",
            "file_extension",
            "file_size",
            "uploaded_by",
            "uploaded_by_username",
            "created_at",
            "updated_at",
        ]

    def get_file_name(self, obj):
        if not obj.file:
            return None

        return obj.file.name.split("/")[-1]

    def get_file_extension(self, obj):
        if not obj.file:
            return None

        file_name = obj.file.name.split("/")[-1]

        if "." not in file_name:
            return None

        return file_name.rsplit(".", 1)[-1].upper()

    def get_file_size(self, obj):
        if not obj.file:
            return None

        try:
            return obj.file.size
        except (OSError, ValueError):
            return None


class ProgrammeSerializer(serializers.ModelSerializer):

    department_name = serializers.CharField(
        source="department.name",
        read_only=True,
    )

    class Meta:
        model = Programme
        fields = [
            "id",
            "name",
            "slug",
            "department",
            "department_name",
            
        ]


class AcademicSessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = AcademicSession
        fields = [
            "id",
            "name",
            "start_year",
            "end_year",
            "is_active",
        ]


class CourseOfferingSerializer(serializers.ModelSerializer):

    course_code = serializers.CharField(
        source="course.code",
        read_only=True,
    )

    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    academic_session_name = serializers.CharField(
        source="academic_session.name",
        read_only=True,
    )

    class Meta:
        model = CourseOffering
        fields = [
            "id",
            "course",
            "course_code",
            "course_title",
            "academic_session",
            "academic_session_name",
        ]
