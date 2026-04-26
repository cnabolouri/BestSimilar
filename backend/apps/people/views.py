from django.db.models import Q
from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.people.models import Person
from apps.people.serializers import PersonListSerializer, PersonDetailSerializer

from rest_framework import viewsets
from django.db.models import Prefetch

from apps.people.models import Person
from apps.credits.models import TitleCredit
from apps.people.serializers import PersonDetailSerializer

from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.people.serializers import RelatedPersonSerializer

from django.db.models import Case, When, IntegerField



class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PersonDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        queryset = (
            Person.objects.all()
            .prefetch_related(
                "news_items",
                "credits__title__genres",
            )
        )

        q = self.request.query_params.get("q")
        department = self.request.query_params.get("department")

        if department:
            queryset = queryset.filter(known_for_department__iexact=department)

        if q:
            queryset = queryset.filter(name__icontains=q).annotate(
                search_rank=Case(
                    When(name__iexact=q, then=0),
                    When(name__istartswith=q, then=1),
                    When(name__icontains=q, then=2),
                    default=3,
                    output_field=IntegerField(),
                )
            ).order_by("search_rank", "-popularity", "name")
        else:
            queryset = queryset.order_by("-popularity", "name")

        return queryset.distinct()

class PersonListAPIView(ListAPIView):
    serializer_class = PersonListSerializer

    def get_queryset(self):
        queryset = Person.objects.all().order_by("-popularity", "name")

        q = self.request.query_params.get("q")
        department = self.request.query_params.get("department")
        ordering = self.request.query_params.get("ordering")

        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(known_for_department__icontains=q)
            )

        if department:
            queryset = queryset.filter(known_for_department__iexact=department)

        allowed_ordering = {
            "popularity": "-popularity",
            "name": "name",
        }

        if ordering in allowed_ordering:
            queryset = queryset.order_by(allowed_ordering[ordering])

        return queryset.distinct()


class PersonDetailAPIView(RetrieveAPIView):
    serializer_class = PersonDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Person.objects.all().prefetch_related("credits__title")