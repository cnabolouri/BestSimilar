import { PublicSectionPage } from "../PublicSectionPage";

type PublicRatingsPageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicRatingsPage({
  params,
}: PublicRatingsPageProps) {
  const { username } = await params;

  return (
    <PublicSectionPage
      username={username}
      section="ratings"
      title={`@${username}'s Ratings`}
      emptyText="No public ratings yet."
      privateText="These ratings are private."
    />
  );
}
