import { PublicSectionPage } from "../PublicSectionPage";

type PublicReviewsPageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicReviewsPage({
  params,
}: PublicReviewsPageProps) {
  const { username } = await params;

  return (
    <PublicSectionPage
      username={username}
      section="reviews"
      title={`@${username}'s Reviews`}
      emptyText="No public reviews yet."
      privateText="These reviews are private."
    />
  );
}
