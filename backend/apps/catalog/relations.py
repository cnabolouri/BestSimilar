# backend/apps/catalog/relations.py
# You can also keep these inside catalog/models.py if you prefer fewer files.

from django.db import models
from apps.catalog.models import Title
from apps.taxonomy.models import Genre, Theme, Keyword


class TitleGenre(models.Model):
    title = models.ForeignKey(Title, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("title", "genre")


class TitleTheme(models.Model):
    title = models.ForeignKey(Title, on_delete=models.CASCADE)
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE)
    weight = models.FloatField(default=1.0)

    class Meta:
        unique_together = ("title", "theme")


class TitleKeyword(models.Model):
    title = models.ForeignKey(Title, on_delete=models.CASCADE)
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("title", "keyword")