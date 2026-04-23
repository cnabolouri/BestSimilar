from apps.catalog.models import Title
from apps.people.models import Person
from apps.taxonomy.models import Genre, Keyword
from .normalizers import normalize_movie_payload, normalize_tv_payload, normalize_person_payload
from apps.credits.models import TitleCredit

def upsert_movie(data: dict) -> Title:
    payload = normalize_movie_payload(data)
    obj, _ = Title.objects.update_or_create(
        tmdb_id=payload["tmdb_id"],
        defaults=payload,
    )
    _attach_genres(obj, data)
    _attach_keywords(obj, data, media_type="movie")
    attach_credits(obj, data)
    return obj


def upsert_tv(data: dict) -> Title:
    payload = normalize_tv_payload(data)
    obj, _ = Title.objects.update_or_create(
        tmdb_id=payload["tmdb_id"],
        defaults=payload,
    )
    _attach_genres(obj, data)
    _attach_keywords(obj, data, media_type="tv")
    attach_credits(obj, data)
    return obj

def upsert_person(data: dict) -> Person:
    payload = normalize_person_payload(data)
    obj, _ = Person.objects.update_or_create(
        tmdb_id=payload["tmdb_id"],
        defaults=payload,
    )
    return obj


def _attach_genres(title: Title, data: dict) -> None:
    genre_ids = data.get("genres", [])
    genre_objects = []

    for item in genre_ids:
        genre, _ = Genre.objects.get_or_create(
            tmdb_id=item["id"],
            defaults={
                "name": item["name"],
                "category": Genre.Category.BOTH,
            },
        )
        genre_objects.append(genre)

    if genre_objects:
        title.genres.set(genre_objects)
    else:
        title.genres.clear()


def _attach_keywords(title: Title, data: dict, media_type: str) -> None:
    if media_type == "movie":
        keyword_items = data.get("keywords", {}).get("keywords", [])
    else:
        keyword_items = data.get("keywords", {}).get("results", [])

    keyword_objects = []

    for item in keyword_items:
        keyword, _ = Keyword.objects.get_or_create(
            tmdb_id=item["id"],
            defaults={"name": item["name"]},
        )
        keyword_objects.append(keyword)

    if keyword_objects:
        title.keywords.set(keyword_objects)
    else:
        title.keywords.clear()
        
        
def attach_credits(title: Title, data: dict) -> None:
    credits = data.get("credits", {})
    cast_items = credits.get("cast", [])
    crew_items = credits.get("crew", [])

    TitleCredit.objects.filter(title=title).delete()

    for cast in cast_items[:20]:
        person = upsert_person({
            "id": cast["id"],
            "name": cast.get("name", ""),
            "known_for_department": cast.get("known_for_department", ""),
            "biography": "",
            "birthday": None,
            "deathday": None,
            "place_of_birth": "",
            "profile_path": cast.get("profile_path", "") or "",
            "popularity": cast.get("popularity", 0.0) or 0.0,
        })

        TitleCredit.objects.create(
            title=title,
            person=person,
            role_type=TitleCredit.RoleType.ACTOR,
            character_name=cast.get("character", "") or "",
            billing_order=cast.get("order"),
        )

    relevant_jobs = {
        "Director": TitleCredit.RoleType.DIRECTOR,
        "Writer": TitleCredit.RoleType.WRITER,
        "Screenplay": TitleCredit.RoleType.WRITER,
        "Creator": TitleCredit.RoleType.CREATOR,
        "Producer": TitleCredit.RoleType.PRODUCER,
        "Executive Producer": TitleCredit.RoleType.PRODUCER,
    }

    for crew in crew_items:
        job = crew.get("job", "")
        role_type = relevant_jobs.get(job)
        if not role_type:
            continue

        person = upsert_person({
            "id": crew["id"],
            "name": crew.get("name", ""),
            "known_for_department": crew.get("known_for_department", ""),
            "biography": "",
            "birthday": None,
            "deathday": None,
            "place_of_birth": "",
            "profile_path": crew.get("profile_path", "") or "",
            "popularity": crew.get("popularity", 0.0) or 0.0,
        })

        TitleCredit.objects.create(
            title=title,
            person=person,
            role_type=role_type,
            job_name=job,
        )