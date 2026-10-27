from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import MaterialChunk


@admin.register(MaterialChunk)
class MaterialChunkAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "material",
        "page_number",
        "chunk_index",
        "embedding_model",
        "updated_at",
    )

    list_filter = ("embedding_model",)
    search_fields = (
        "text",
        "material__title",
        "material__course__code",
    )

    readonly_fields = ("created_at", "updated_at")
