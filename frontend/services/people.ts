import { apiGet } from "@/lib/api";
import type { PersonDetail } from "@/types/person";

export async function getPersonDetail(slug: string) {
  return apiGet<PersonDetail>(`/people/${slug}/`);
}