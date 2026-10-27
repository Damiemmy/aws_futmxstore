
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .embeddings import EMBEDDING_MODEL_NAME, embed_query
from .selectors import get_searchable_chunks


RRF_K = 60


def reciprocal_rank_fusion(
    rankings: list[list[int]],
    k: int = RRF_K,
) -> dict[int, float]:
    """
    Combine ranked chunk IDs.

    A chunk appearing near the top of multiple rankings
    receives a stronger fused score.
    """
    fused_scores = {}

    for ranking in rankings:
        for rank, chunk_id in enumerate(ranking, start=1):
            fused_scores[chunk_id] = (
                fused_scores.get(chunk_id, 0.0)
                + 1 / (k + rank)
            )

    return fused_scores


def hybrid_search(query: str, top_k: int = 5) -> list[dict]:
    """
    Retrieve approved academic PDF chunks using TF-IDF,
    semantic similarity, and Reciprocal Rank Fusion.
    """
    query = query.strip()

    if not query:
        return []

    if top_k < 1:
        raise ValueError("top_k must be at least 1.")

    chunks = list(get_searchable_chunks())

    if not chunks:
        return []

    texts = [chunk.text for chunk in chunks]

    # 1. Keyword retrieval with TF-IDF.
    vectorizer = TfidfVectorizer()
    keyword_ranking = []

    try:
        document_matrix = vectorizer.fit_transform(texts)
        query_vector = vectorizer.transform([query])

        keyword_scores = cosine_similarity(
            query_vector,
            document_matrix,
        ).ravel()

        keyword_order = np.argsort(-keyword_scores, kind="stable")

        keyword_ranking = [
            chunks[i].id
            for i in keyword_order
            if keyword_scores[i] > 0
        ]

    except ValueError:
        # For example, all document texts contain no usable tokens.
        keyword_scores = np.zeros(len(chunks))

    # 2. Semantic retrieval with embeddings.
    query_embedding = np.asarray(embed_query(query), dtype=np.float32)

    semantic_scores = np.zeros(len(chunks), dtype=np.float32)
    semantic_ranking = []

    for i, chunk in enumerate(chunks):
        if (
            chunk.embedding_model != EMBEDDING_MODEL_NAME
            or not chunk.embedding
        ):
            continue

        vector = np.asarray(chunk.embedding, dtype=np.float32)

        if vector.shape != query_embedding.shape:
            continue

        # Embeddings are normalized during creation, so dot product
        # gives cosine similarity for compatible normalized vectors.
        semantic_scores[i] = float(np.dot(query_embedding, vector))

    semantic_order = np.argsort(-semantic_scores, kind="stable")

    semantic_ranking = [
        chunks[i].id
        for i in semantic_order
        if (
            chunks[i].embedding_model == EMBEDDING_MODEL_NAME
            and chunks[i].embedding
            and semantic_scores[i] > 0
        )
    ]

    # 3. Fuse keyword and semantic rankings.
    fused_scores = reciprocal_rank_fusion(
        [keyword_ranking, semantic_ranking]
    )

    chunk_by_id = {chunk.id: chunk for chunk in chunks}

    ranked_ids = sorted(
        fused_scores,
        key=lambda chunk_id: fused_scores[chunk_id],
        reverse=True,
    )[:top_k]

    results = []

    for chunk_id in ranked_ids:
        chunk = chunk_by_id[chunk_id]
        index = next(i for i, item in enumerate(chunks) if item.id == chunk_id)

        try:
            material_url = chunk.material.file.url
        except (ValueError, AttributeError):
            material_url = None

        results.append({
            "chunk_id": chunk.id,
            "material_id": chunk.material_id,
            "material_title": chunk.material.title,
            "course_code": chunk.material.course.code,
            "page_number": chunk.page_number,
            "chunk_index": chunk.chunk_index,
            "text": chunk.text,
            "material_url": material_url,
            "rrf_score": fused_scores[chunk_id],
            "keyword_score": float(keyword_scores[index]),
            "semantic_score": float(semantic_scores[index]),
        })

    return results
