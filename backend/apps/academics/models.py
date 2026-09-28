from django.db import models
from django.conf import settings
from django.db.models import Q


class Faculty(models.Model):
    name = models.CharField(
        max_length=150,
        unique=True,
    )

    slug = models.SlugField(
        max_length=150,
        unique=True,
    )

    def __str__(self):
        return self.name


class Department(models.Model):
    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name="departments",
    )

    name = models.CharField(
        max_length=150,
    )

    slug = models.SlugField(
        unique=True,
        max_length=150,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["faculty", "name"],
                name="unique_department_per_faculty",
            )
        ]

    def __str__(self):
        return self.name


class Programme(models.Model):
    """
    Represents an academic programme/specialization under a department.

    Example:

    Industrial and Technology Education
        ├── Automobile Technology Education
        ├── Building Technology Education
        ├── Electrical and Electronics Technology Education
        ├── Metalwork Technology Education
        └── Woodwork Technology Education

    A department does not necessarily need a Programme.
    """

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="programmes",
    )

    name = models.CharField(
        max_length=200,
    )

    slug = models.SlugField(
        max_length=200,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["department", "name"],
                name="unique_programme_per_department",
            ),
            models.UniqueConstraint(
                fields=["department", "slug"],
                name="unique_programme_slug_per_department",
            ),
        ]

    def __str__(self):
        return self.name


class Level(models.Model):
    """
    Academic level.

    programme is nullable during the migration period so that
    existing production levels continue to work.

    Eventually:

        Department
            └── Programme
                    └── Level

    For departments without programmes:

        Department
            └── Level
    """
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="levels",
    )

    programme = models.ForeignKey(
        Programme,
        on_delete=models.CASCADE,
        related_name="levels",
        null=True,
        blank=True,
    )

    name = models.CharField(
        max_length=20,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                # General department-level context:
                # `programme=NULL` means this level belongs to the department as a whole,
                # not to any specific programme.
                #
                # Example:
                #   ITE + 100 Level + NULL
                #   → "This applies generally to all relevant ITE 100-level students."
                #
                # Therefore, the exact same combination must exist only once.
                # Two identical records would mean we created the same general context twice.
                #
                # Programme-specific contexts are different:
                #   ITE + Computer Science + 100 Level
                #   ITE + Cyber Security + 100 Level
                #   → These represent different student groups, so both are valid.
                #
                # MEMORY RULE:
                #   NULL programme = GENERAL department context → ONE per department + level
                #   Programme specified = SPECIFIC programme context → ONE per programme + level
                fields=["department", "name"],
                condition=Q(programme__isnull=True), #If a Level does NOT belong to a programme, its department + name must be unique.
                name="unique_general_level_per_department",
            ),
            models.UniqueConstraint(
                fields=["programme","name"],#this is the default
                name="unique_level_per_programme",
            ),
        ]

    def __str__(self):
        if self.programme:
            return f"{self.name} - {self.programme}"

        return f"{self.name} - {self.department}"

class AcademicSession(models.Model):
    """
    Represents an academic session/year.

    Examples:
        2024/2025
        2025/2026
        2026/2027
    """

    name = models.CharField(
        max_length=20,
        unique=True,
    )

    start_year = models.PositiveIntegerField()

    end_year = models.PositiveIntegerField()

    is_active = models.BooleanField(
        default=False,
    )

    class Meta:
        ordering = ["-start_year"]

    def __str__(self):
        return self.name


class Semester(models.Model):
    level = models.ForeignKey(
        Level,
        on_delete=models.CASCADE,
        related_name="semesters",
    )

    name = models.CharField(
        max_length=30,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["level", "name"],
                name="unique_semester_per_level",
            )
        ]

    def __str__(self):
        return self.name


class Course(models.Model):
    """
    Represents the reusable academic course itself.

    Example:

        CSC 401
        Software Engineering
        3 units

    The academic session is NOT stored directly here because
    the same course can exist across multiple academic sessions.
    """

    semester = models.ForeignKey(
        Semester,
        on_delete=models.CASCADE,
        related_name="courses",
    )

    code = models.CharField(
        max_length=20,
    )

    title = models.CharField(
        max_length=200,
    )

    unit = models.PositiveSmallIntegerField(
        default=2,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["semester", "code"],
                name="unique_course_per_semester",
            )
        ]

    def __str__(self):
        return f"{self.code} - {self.title}"


class CourseOffering(models.Model):
    """
    Connects a reusable Course to a specific academic session.

    Example:

        CSC 401
        400 Level
        First Semester
        2025/2026
    """

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="offerings",
    )

    academic_session = models.ForeignKey(
        AcademicSession,
        on_delete=models.PROTECT,
        related_name="course_offerings",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["course", "academic_session"],
                name="unique_course_offering_per_session",
            )
        ]

    def __str__(self):
        return f"{self.course} - {self.academic_session}"


class Material(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="materials",
    )

    # New relationship.
    #
    # Nullable temporarily because existing production materials
    # do not yet know their academic session.
    course_offering = models.ForeignKey(
        CourseOffering,
        on_delete=models.PROTECT,
        related_name="materials",
        null=True,
        blank=True,
    )

    title = models.CharField(
        max_length=200,
    )

    description = models.TextField(
        blank=True,
    )

    file = models.FileField(
        upload_to="materials/",
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="uploaded_materials",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.title