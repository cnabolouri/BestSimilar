import { PublicSectionPage } from "../PublicSectionPage";

type PublicFavoritesPageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicFavoritesPage({
  params,
}: PublicFavoritesPageProps) {
  const { username } = await params;

  return (
    <PublicSectionPage
      username={username}
      section="favorites"
      title={`@${username}'s Favorites`}
      emptyText="No public favorites yet."
      privateText="These favorites are private."
    />
  );
}
