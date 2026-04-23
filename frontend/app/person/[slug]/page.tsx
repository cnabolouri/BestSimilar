import { getPersonDetail } from "@/services/people";
import { PersonDetailPage } from "@/components/people/person-detail-page";

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = await getPersonDetail(slug);

  return <PersonDetailPage person={person} />;
}