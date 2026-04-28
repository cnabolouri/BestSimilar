import { PublicSectionPage } from "../PublicSectionPage";

type PublicHistoryPageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicHistoryPage({
  params,
}: PublicHistoryPageProps) {
  const { username } = await params;

  return (
    <PublicSectionPage
      username={username}
      section="history"
      title={`@${username}'s Watch History`}
      emptyText="No public watch history yet."
      privateText="This watch history is private."
    />
  );
}
