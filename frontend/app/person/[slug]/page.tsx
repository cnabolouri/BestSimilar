import { getPersonDetail, getRelatedPeople } from "@/services/people";
import { PersonDetailPage } from "@/components/people/person-detail-page";

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [person, relatedPeople] = await Promise.all([
    getPersonDetail(slug),
    getRelatedPeople(slug),
  ]);

  return <PersonDetailPage person={person} relatedPeople={relatedPeople} />;
}