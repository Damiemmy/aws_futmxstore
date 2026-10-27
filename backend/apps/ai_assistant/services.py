import hashlib

# import fitz
import pymupdf
from django.db import transaction
from .generator import (
    AnswerGenerationError,
    generate_grounded_answer,
    generate_material_summary,
)

from .embeddings import EMBEDDING_MODEL_NAME, embed_texts
from .models import MaterialChunk
from .selectors import get_approved_material_for_indexing
from apps.academics.models import Course, Material

CHUNK_SIZE = 180
CHUNK_OVERLAP = 30


def extract_pdf_pages(pdf_bytes: bytes) -> list[dict]:
    """Extract text from a PDF while preserving page numbers."""
    pages = []

    with pymupdf.open(stream=pdf_bytes, filetype="pdf") as pdf:
        for page_number, page in enumerate(pdf, start=1):
            text = page.get_text("text").strip()

            if text:
                pages.append({
                    "page_number": page_number,
                    "text": text,
                })

    return pages


def chunk_page(
    text: str,
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> list[str]:
    """Split a page into overlapping word-based chunks."""
    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive.")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("overlap must be between 0 and chunk_size.")

    words = text.split()
    chunks = []
    step = chunk_size - overlap

    for start in range(0, len(words), step):
        chunk_words = words[start:start + chunk_size]

        if not chunk_words:
            break

        chunks.append(" ".join(chunk_words))

        if start + chunk_size >= len(words):
            break

    return chunks


def build_chunk_records(pages: list[dict], file_hash: str) -> list[dict]:
    """Create text chunks and stable content hashes."""
    records = []

    for page in pages:
        chunks = chunk_page(page["text"])

        for chunk_index, text in enumerate(chunks):
            identity = (
                f"{file_hash}:"
                f"{page['page_number']}:"
                f"{chunk_index}:"
                f"{text}"
            )

            records.append({
                "page_number": page["page_number"],
                "chunk_index": chunk_index,
                "text": text,
                "content_hash": hashlib.sha256(
                    identity.encode("utf-8")
                ).hexdigest(),
            })

    return records


def index_material(material_id: int) -> dict:
    """
    Extract, embed, and persist one currently approved PDF.

    Existing chunks are replaced only after extraction and embedding
    complete successfully.
    """
    material = get_approved_material_for_indexing(material_id)

    if material is None:
        # Do not return whether an unapproved material exists.
        return {
            "material_id": material_id,
            "status": "skipped",
            "reason": "Material is not currently eligible for indexing.",
            "chunks_indexed": 0,
        }

    with material.file.open("rb") as pdf_file:
        pdf_bytes = pdf_file.read()

    file_hash = hashlib.sha256(pdf_bytes).hexdigest()
    pages = extract_pdf_pages(pdf_bytes)
    records = build_chunk_records(pages, file_hash)

    if not records:
        # The current PDF has no extractable text. Clear stale chunks
        # so an older version of the document is not returned.
        with transaction.atomic():
            MaterialChunk.objects.filter(material_id=material_id).delete()

        return {
            "material_id": material_id,
            "status": "no_extractable_text",
            "reason": (
                "No extractable text was found. The PDF may be scanned "
                "and require OCR."
            ),
            "chunks_indexed": 0,
        }

    vectors = embed_texts([record["text"] for record in records])

    chunk_objects = [
        MaterialChunk(
            material_id=material_id,
            page_number=record["page_number"],
            chunk_index=record["chunk_index"],
            text=record["text"],
            embedding=vector,
            embedding_model=EMBEDDING_MODEL_NAME,
            content_hash=record["content_hash"],
        )
        for record, vector in zip(records, vectors)
    ]

    # Re-check approval inside the transaction before replacing the index.
    with transaction.atomic():
        still_approved = get_approved_material_for_indexing(material_id)

        if still_approved is None:
            return {
                "material_id": material_id,
                "status": "skipped",
                "reason": "Material is no longer eligible for indexing.",
                "chunks_indexed": 0,
            }

        MaterialChunk.objects.filter(material_id=material_id).delete()
        MaterialChunk.objects.bulk_create(chunk_objects, batch_size=100)

    return {
        "material_id": material_id,
        "status": "indexed",
        "chunks_indexed": len(chunk_objects),
    }



def search_material_chunks(query: str, top_k: int = 5) -> list[dict]:
    """Application service for hybrid academic-resource retrieval."""
    from .retrieval import hybrid_search

    return hybrid_search(query=query, top_k=top_k)




# def answer_question(question: str, top_k: int = 5) -> dict:
#     """
#     Retrieve academic evidence and generate a grounded answer.
#     """
#     question = question.strip()

#     if not question:
#         return {
#             "status": "insufficient_evidence",
#             "answer": (
#                 "Please enter an academic question so I can help "
#                 "you find relevant study materials."
#             ),
#             "sources": [],
#         }

#     results = search_material_chunks(
#         query=question,
#         top_k=top_k,
#     )

#     # These are initial guardrails, not universal relevance scores.
#     # Validate and tune them against real FUTMxStore questions.
#     has_keyword_match = any(
#         item["keyword_score"] >= 0.10
#         for item in results
#     )
#     has_semantic_match = any(
#         item["semantic_score"] >= 0.35
#         for item in results
#     )

#     if not results or not (has_keyword_match or has_semantic_match):
#         return {
#             "status": "insufficient_evidence",
#             "answer": (
#                 "I couldn't find sufficiently relevant evidence in "
#                 "the currently approved indexed materials to answer "
#                 "that confidently. Try rephrasing your question or "
#                 "searching for the relevant course or lecture note."
#             ),
#             "sources": [],
#         }

#     evidence = results[:top_k]
#     answer = generate_grounded_answer(question, evidence)

#     sources = [
#         {
#             "source_id": f"S{index}",
#             "material_id": item["material_id"],
#             "title": item["material_title"],
#             "course_code": item["course_code"],
#             "page_number": item["page_number"],
#             "material_url": item["material_url"],
#         }
#         for index, item in enumerate(evidence, start=1)
#     ]

#     return {
#         "status": "answered",
#         "answer": answer,
#         "sources": sources,
#     }


def answer_question(question: str, top_k: int = 5) -> dict:
    """Handle academic conversation and evidence-grounded questions."""
    question = question.strip()

    if not question:
        return {
            "status": "invalid_question",
            "answer": "Please enter a question or message about your studies.",
            "sources": [],
        }

    results = search_material_chunks(query=question, top_k=top_k)

    has_relevant_evidence = bool(results) and any(
        item["keyword_score"] >= 0.10
        or item["semantic_score"] >= 0.35
        for item in results
    )

    evidence = results if has_relevant_evidence else []

    answer = generate_grounded_answer(
        question=question,
        evidence=evidence,
    )

    sources = []

    if has_relevant_evidence:
        sources = [
            {
                "source_id": f"S{index}",
                "material_id": item["material_id"],
                "title": item["material_title"],
                "course_code": item["course_code"],
                "page_number": item["page_number"],
                "material_url": item["material_url"],
            }
            for index, item in enumerate(evidence, start=1)
        ]

    return {
        "status": "answered" if evidence else "conversation",
        "answer": answer,
        "sources": sources,
    }



def summarize_material(material_id: int) -> dict:
    """
    Summarize an approved PDF from its complete indexed chunk set.
    """
    material = get_approved_material_for_indexing(material_id)

    if material is None:
        return {
            "status": "unavailable",
            "message": (
                "This material is unavailable or is not approved "
                "for academic assistance."
            ),
        }

    chunks = list(
        MaterialChunk.objects.filter(
            material_id=material_id,
            material__status=Material.Status.APPROVED,
            material__course__status=Course.Status.APPROVED,
        ).order_by("page_number", "chunk_index")
    )

    if not chunks:
        return {
            "status": "not_indexed",
            "message": (
                "This material has no indexed text available for "
                "summarization. It may need to be indexed first."
            ),
        }

    # Summarize in batches to avoid sending an entire long PDF
    # in one generation request.
    batch_size = 8
    intermediate_summaries = []

    for start in range(0, len(chunks), batch_size):
        batch = chunks[start:start + batch_size]

        page_numbers = sorted({
            chunk.page_number for chunk in batch
        })

        page_range = (
            str(page_numbers[0])
            if len(page_numbers) == 1
            else f"{page_numbers[0]}-{page_numbers[-1]}"
        )

        section = {
            "page_range": page_range,
            "text": "\n\n".join(chunk.text for chunk in batch),
        }

        summary = generate_material_summary(
            material_title=material.title,
            sections=[section],
        )

        intermediate_summaries.append({
            "page_range": page_range,
            "text": summary,
        })

    # Even a short document gets a final synthesis pass.
    final_summary = generate_material_summary(
        material_title=material.title,
        sections=intermediate_summaries,
        final=True,
    )

    return {
        "status": "summarized",
        "material_id": material.id,
        "title": material.title,
        "pages_processed": len({
            chunk.page_number for chunk in chunks
        }),
        "summary": final_summary,
    }
