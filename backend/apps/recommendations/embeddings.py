from google import genai
from django.conf import settings


client = genai.Client(api_key=settings.GEMINI_API_KEY)


def build_embedding_text(title) -> str:
    genres = ", ".join(title.genres.values_list("name", flat=True))
    keywords = ", ".join(title.keywords.values_list("name", flat=True))

    parts = [
        f"Title: {title.name}",
        f"Original title: {title.original_name}" if title.original_name else "",
        f"Media type: {title.media_type}",
        f"Overview: {title.overview}" if title.overview else "",
        f"Tagline: {title.tagline}" if title.tagline else "",
        f"Genres: {genres}" if genres else "",
        f"Keywords: {keywords}" if keywords else "",
    ]

    return "\n".join(part for part in parts if part).strip()


def generate_embedding(text: str) -> list[float]:
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )
    return response.embeddings[0].values