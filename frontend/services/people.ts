import { apiGet } from "@/lib/api";
import type { PersonDetail } from "@/types/person";

import type { RelatedPerson } from "@/types/person";

import type { PaginatedResponse } from "@/types/api";
import type { SearchPerson } from "@/types/search";

export async function browsePeople(input: {
  department?: string;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (input.department) params.set("department", input.department);
  if (input.page) params.set("page", String(input.page));

  return apiGet<PaginatedResponse<SearchPerson>>(
    `/people/?${params.toString()}`
  );
}

export async function getRelatedPeople(slug: string) {
  return apiGet<RelatedPerson[]>(`/people/${slug}/related/`);
}

export async function getPersonDetail(slug: string) {
  return apiGet<PersonDetail>(`/people/${slug}/`);
}