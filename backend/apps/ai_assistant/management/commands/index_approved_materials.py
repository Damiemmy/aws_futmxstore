
from django.core.management.base import BaseCommand, CommandError

from apps.ai_assistant.selectors import get_approved_materials_for_indexing
from apps.ai_assistant.services import index_material


class Command(BaseCommand):
    help = "Index approved PDF materials for AI retrieval."

    def add_arguments(self, parser):
        parser.add_argument(
            "--material-id",
            type=int,
            help="Index one specific eligible material.",
        )

    def handle(self, *args, **options):
        material_id = options["material_id"]

        if material_id is not None:
            material_ids = [material_id]
        else:
            material_ids = list(
                get_approved_materials_for_indexing()
                .values_list("id", flat=True)
            )

        if not material_ids:
            self.stdout.write(
                self.style.WARNING("No eligible approved PDF materials found.")
            )
            return

        indexed = 0
        skipped = 0
        failed = 0

        self.stdout.write(
            f"Processing {len(material_ids)} material(s)..."
        )

        for current_id in material_ids:
            try:
                result = index_material(current_id)

                if result["status"] == "indexed":
                    indexed += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Material {current_id}: indexed "
                            f"{result['chunks_indexed']} chunks."
                        )
                    )
                else:
                    skipped += 1
                    self.stdout.write(
                        self.style.WARNING(
                            f"Material {current_id}: "
                            f"{result['status']} — {result['reason']}"
                        )
                    )

            except Exception as exc:
                failed += 1
                self.stderr.write(
                    self.style.ERROR(
                        f"Material {current_id}: indexing failed "
                        f"({type(exc).__name__}): {exc}"
                    )
                )

        self.stdout.write(
            f"Finished. Indexed: {indexed}; "
            f"skipped: {skipped}; failed: {failed}."
        )

        if failed:
            raise CommandError(
                f"{failed} material(s) failed. Review the errors above."
            )
