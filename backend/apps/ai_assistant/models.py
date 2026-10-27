from django.db import models
from apps.academics.models import Material
from django.conf import settings

# Create your models here.

#AI DOMAIN
class MaterialChunk(models.Model):

    """
    A searchable text chunk extracted from an academic PDF.

    Each chunk belongs to an existing Material. Approval status
    remains controlled by the academics app.
    """

    material = models.ForeignKey(
        "academics.Material",
        on_delete=models.CASCADE,
        related_name="ai_chunks",
    )

    page_number = models.PositiveIntegerField()

    chunk_index = models.PositiveIntegerField()

    text = models.TextField()

    # Store the embedding as a JSON array initially.
    # This keeps the first version compatible with SQLite
    # and PostgreSQL without requiring a vector database.
    embedding = models.JSONField(default=list, blank=True)

    # Identifies which embedding model generated the vector.
    embedding_model = models.CharField(
        max_length=100,
        blank=True,
    )

    # Used to detect changes to the extracted chunk content.
    content_hash = models.CharField(
        max_length=64,
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["material_id", "page_number", "chunk_index"]

        constraints = [
            models.UniqueConstraint(
                fields=["material", "page_number", "chunk_index"],
                name="unique_ai_chunk_per_material_page",
            )
        ]

        indexes = [
            models.Index(
                fields=["material", "page_number"],
                name="ai_chunk_material_page_idx",
            ),
        ]

    def __str__(self):
        return (
            f"Material {self.material_id} — "
            f"page {self.page_number}, chunk {self.chunk_index}"
        )
