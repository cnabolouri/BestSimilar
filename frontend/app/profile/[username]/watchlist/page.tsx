import { PublicSectionPage } from "../PublicSectionPage";

type PublicWatchlistPageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicWatchlistPage({
  params,
}: PublicWatchlistPageProps) {
  const { username } = await params;

  return (
    <PublicSectionPage
      username={username}
      section="watchlist"
      title={`@${username}'s Watchlist`}
      emptyText="No public watchlist items yet."
      privateText="This watchlist is private."
    />
  );
}
