from django.contrib import admin
from .models import Faculty, Department, Course, Semester, Level, Material,Programme,AcademicSession,CourseOffering

# Register your models here.

admin.site.register(Faculty)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Semester)
admin.site.register(Level)
admin.site.register(Material)
admin.site.register(AcademicSession)
admin.site.register(Programme)
admin.site.register(CourseOffering)
