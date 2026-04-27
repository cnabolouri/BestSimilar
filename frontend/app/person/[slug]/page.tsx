import { getPersonDetail, getRelatedPeople } from "@/services/people";
import { PersonDetailPage } from "@/components/people/person-detail-page";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const person = await getPersonDetail(slug);

  let relatedPeople = [];

  try {
    relatedPeople = await getRelatedPeople(slug);
  } catch {
    relatedPeople = [];
  }

  return <PersonDetailPage person={person} relatedPeople={relatedPeople} />;
}