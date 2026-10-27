
from apps.academics.models import Course, Material
from .models import MaterialChunk


def get_approved_materials_for_indexing():
    """
    Return PDF materials whose material and parent course
    are both approved.
    """
    return (
        Material.objects.filter(
            status=Material.Status.APPROVED,
            course__status=Course.Status.APPROVED,
            file__iendswith=".pdf",
        )
        .select_related(
            "course",
            "course__semester",
            "course__semester__level",
        )
        .order_by("id")
    )


def get_approved_material_for_indexing(material_id: int):
    """
    Retrieve one indexable material, enforcing both approval states.
    """
    return (
        get_approved_materials_for_indexing()
        .filter(id=material_id)
        .first()
    )


def get_searchable_chunks():
    """
    Return chunks only when their material and parent course
    are currently approved.
    """
    return (
        MaterialChunk.objects.filter(
            material__status=Material.Status.APPROVED,
            material__course__status=Course.Status.APPROVED,
        )
        .select_related(
            "material",
            "material__course",
            "material__course__semester",
        )
        .order_by("id")
    )
