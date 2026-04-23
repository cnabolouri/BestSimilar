from pgvector.django import CosineDistance

from apps.recommendations.embeddings import generate_embedding
from apps.recommendations.models import TitleEmbedding


def build_match_explanation(title, prompt: str) -> str:
    genres = [genre.name for genre in title.genres.all()[:3]]
    genre_text = ", ".join(genres) if genres else "similar themes"

    if prompt:
        return f"Matches your prompt through {genre_text.lower()} and semantically related story cues."
    return "Semantically matched to your prompt."


def discover_titles_from_prompt(prompt: str, media_type: str | None = None, limit: int = 10):
    prompt_vector = generate_embedding(prompt)

    queryset = (
        TitleEmbedding.objects.filter(
            embedding_source=TitleEmbedding.EmbeddingSource.COMBINED,
            model_name="gemini-embedding-001",
        )
        .select_related("title")
        .prefetch_related("title__genres", "title__credits__person")
        .annotate(distance=CosineDistance("vector", prompt_vector))
    )

    if media_type in {"movie", "tv"}:
        queryset = queryset.filter(title__media_type=media_type)

    queryset = queryset.order_by("distance")[:limit]

    results = []
    for item in queryset:
        title = item.title
        title.semantic_distance = float(item.distance)
        title.similarity_score = round(max(0.0, 1.0 - float(item.distance)), 4)
        title.similarity_reasons = ["Matched your prompt semantically"]
        title.match_explanation = build_match_explanation(title, prompt)
        results.append(title)

    return results