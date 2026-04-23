from pgvector.django import CosineDistance

from apps.catalog.models import Title
from apps.recommendations.models import TitleEmbedding


def get_metadata_similar_titles(source_title: Title, limit: int = 50):
    source_genres = set(source_title.genres.values_list("id", flat=True))
    source_keywords = set(source_title.keywords.values_list("id", flat=True))
    source_people = set(source_title.credits.values_list("person_id", flat=True))
    source_genre_names = set(source_title.genres.values_list("name", flat=True))

    candidates = (
        Title.objects.filter(media_type=source_title.media_type)
        .exclude(id=source_title.id)
        .prefetch_related("genres", "keywords", "credits__person")
    )

    scored_results = []

    for candidate in candidates:
        score = 0.0
        reasons = []

        candidate_genres = set(candidate.genres.values_list("id", flat=True))
        candidate_keywords = set(candidate.keywords.values_list("id", flat=True))
        candidate_people = set(candidate.credits.values_list("person_id", flat=True))
        candidate_genre_names = set(candidate.genres.values_list("name", flat=True))

        if "Animation" in candidate_genre_names and "Animation" not in source_genre_names:
            continue
        if "Reality" in candidate_genre_names and "Reality" not in source_genre_names:
            continue

        shared_genres = source_genres & candidate_genres
        shared_keywords = source_keywords & candidate_keywords
        shared_people = source_people & candidate_people

        genre_overlap = len(shared_genres)
        keyword_overlap = len(shared_keywords)
        people_overlap = len(shared_people)

        if genre_overlap == 0 and keyword_overlap == 0 and people_overlap == 0:
            continue

        if source_genres:
            genre_score = genre_overlap / max(len(source_genres), 1)
            if genre_overlap >= 2:
                genre_score *= 1.2
            score += genre_score * 0.45

            if shared_genres:
                shared_genre_names = list(
                    candidate.genres.filter(id__in=shared_genres).values_list("name", flat=True)
                )
                reasons.append(f"Shared genres: {', '.join(shared_genre_names[:3])}")

        if len(candidate_genres) == len(source_genres):
            score += 0.05

        if source_keywords:
            keyword_score = keyword_overlap / max(len(source_keywords), 1)
            score += keyword_score * 0.30

            if shared_keywords:
                shared_keyword_names = list(
                    candidate.keywords.filter(id__in=shared_keywords).values_list("name", flat=True)
                )
                reasons.append(f"Shared keywords: {', '.join(shared_keyword_names[:3])}")

        if source_people:
            people_score = people_overlap / max(len(source_people), 1)
            score += people_score * 0.20

            if shared_people:
                shared_people_names = list(
                    candidate.credits.filter(person_id__in=shared_people)
                    .values_list("person__name", flat=True)
                    .distinct()
                )
                reasons.append(f"Shared cast/crew: {', '.join(shared_people_names[:3])}")

        if candidate.vote_average:
            score += min(candidate.vote_average / 10.0, 1.0) * 0.03

        if candidate.popularity:
            score += min(candidate.popularity / 200.0, 1.0) * 0.02

        overlap_signal_count = sum([
            1 if genre_overlap > 0 else 0,
            1 if keyword_overlap > 0 else 0,
            1 if people_overlap > 0 else 0,
        ])
        if overlap_signal_count >= 2:
            score += 0.08
            reasons.append("Matched on multiple similarity signals")

        if genre_overlap <= 1 and keyword_overlap == 0 and people_overlap == 0:
            score -= 0.15

        if "Animation" in candidate_genre_names and "Animation" not in source_genre_names:
            score -= 0.2

        if candidate.vote_count is not None and candidate.vote_count < 50:
            score -= 0.05

        if score > 0:
            candidate.metadata_score = round(score, 4)
            candidate.similarity_reasons = reasons[:3]
            scored_results.append(candidate)

    scored_results.sort(
        key=lambda x: (x.metadata_score, x.vote_average, x.vote_count, x.popularity),
        reverse=True,
    )

    return scored_results[:limit]


def get_embedding_similar_titles(source_title: Title, limit: int = 50):
    source_embedding = TitleEmbedding.objects.filter(
        title=source_title,
        embedding_source=TitleEmbedding.EmbeddingSource.COMBINED,
        model_name="gemini-embedding-001",
    ).first()

    if not source_embedding:
        return []

    similar_embeddings = (
        TitleEmbedding.objects.filter(
            embedding_source=TitleEmbedding.EmbeddingSource.COMBINED,
            model_name="gemini-embedding-001",
            title__media_type=source_title.media_type,
        )
        .exclude(title=source_title)
        .select_related("title")
        .prefetch_related("title__genres")
        .annotate(distance=CosineDistance("vector", source_embedding.vector))
        .order_by("distance")[:limit]
    )

    results = []
    for emb in similar_embeddings:
        title = emb.title
        title.embedding_distance = float(emb.distance)
        title.embedding_score = max(0.0, 1.0 - float(emb.distance))
        results.append(title)

    return results


def get_similar_titles(source_title: Title, limit: int = 20):
    metadata_candidates = get_metadata_similar_titles(source_title, limit=60)
    embedding_candidates = get_embedding_similar_titles(source_title, limit=60)

    merged = {}

    for title in metadata_candidates:
        merged[title.id] = {
            "title": title,
            "metadata_score": getattr(title, "metadata_score", 0.0),
            "embedding_score": 0.0,
            "reasons": getattr(title, "similarity_reasons", []),
        }

    for title in embedding_candidates:
        if title.id not in merged:
            merged[title.id] = {
                "title": title,
                "metadata_score": 0.0,
                "embedding_score": getattr(title, "embedding_score", 0.0),
                "reasons": [],
            }
        else:
            merged[title.id]["embedding_score"] = getattr(title, "embedding_score", 0.0)

    results = []
    for item in merged.values():
        title = item["title"]
        metadata_score = item["metadata_score"]
        embedding_score = item["embedding_score"]

        final_score = (0.35 * metadata_score) + (0.65 * embedding_score)

        reasons = list(item["reasons"])
        if embedding_score > 0:
            reasons.append("Semantic match from Gemini embedding")

        title.similarity_score = round(final_score, 4)
        title.similarity_reasons = reasons[:4]
        results.append(title)

    results.sort(
        key=lambda x: (x.similarity_score, x.vote_average, x.vote_count, x.popularity),
        reverse=True,
    )

    return results[:limit]