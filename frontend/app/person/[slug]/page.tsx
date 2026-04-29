import { getPersonDetail, getRelatedPeople } from "@/services/people";
import { PersonDetailPage } from "@/components/people/person-detail-page";
import type { RelatedPerson } from "@/types/person";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const person = await getPersonDetail(slug);

  let relatedPeople: RelatedPerson[] = [];

  try {
    relatedPeople = await getRelatedPeople(slug);
  } catch {
    relatedPeople = [];
  }

  return <PersonDetailPage person={person} relatedPeople={relatedPeople} />;
}
