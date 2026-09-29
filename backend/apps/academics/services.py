from .models import Material,CourseOffering,Course

from django.http import FileResponse

'''
def create_material(
    *,
    course,
    title,
    description,
    file,
    uploaded_by,
):
    return Material.objects.create(
        course=course,
        title=title,
        description=description,
        file=file,
        uploaded_by=uploaded_by,
    )
'''

def create_material(
    *,
    course,
    academic_session,
    title,
    description,
    file,
    uploaded_by,
):
    course_offering, _ = CourseOffering.objects.get_or_create(
        course=course,
        academic_session=academic_session,
    )

    return Material.objects.create(
        course=course,
        course_offering=course_offering,
        title=title,
        description=description,
        file=file,
        uploaded_by=uploaded_by,
    )



def create_course(
    *,
    code,
    title,
    unit,
    semester,
):
    return Course.objects.create(
        code=code,
        title=title,
        unit=unit,
        semester=semester,
    )



def download_material(material):
    return FileResponse(
        material.file.open("rb"),
        as_attachment=True,
        filename=material.file.name.split("/")[-1],
    )