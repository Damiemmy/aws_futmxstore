from django.contrib import admin
from .models import Faculty, Department, Course, Semester, Level, Material

# Register your models here.

admin.site.register(Faculty)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Semester)
admin.site.register(Level)
admin.site.register(Material)