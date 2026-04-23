from django.db.models import Q
from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.people.models import Person
from apps.people.serializers import PersonListSerializer, PersonDetailSerializer


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