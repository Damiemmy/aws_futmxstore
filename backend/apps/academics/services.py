from .models import Material


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