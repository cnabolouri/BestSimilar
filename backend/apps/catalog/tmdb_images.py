TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"


def build_tmdb_image_url(path: str | None, size: str = "w342") -> str:
    if not path:
        return ""
    if str(path).startswith("http"):
        return path
    return f"{TMDB_IMAGE_BASE}/{size}{path}"
