from .models import Material

from django.http import FileResponse


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


def download_material(material):
    return FileResponse(
        material.file.open("rb"),
        as_attachment=True,
        filename=material.file.name.split("/")[-1],
    )