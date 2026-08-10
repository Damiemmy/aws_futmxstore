from rest_framework import serializers
from .models import Faculty,Department,Level,Semester,Course


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

    class Meta:
        model=Level
        fields=[
            "id",
            "name",
            "department",
            "department_name",
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
            "semester",
            "semester_name",
        ]