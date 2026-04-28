import { notFound } from "next/navigation";
import { PublicPersonGrid } from "@/components/profile/PublicPersonGrid";
import { PublicProfileSectionFilters } from "@/components/profile/PublicProfileSectionFilters";
import { PublicProfileSectionShell } from "@/components/profile/PublicProfileSectionShell";
import { PublicTitleGrid } from "@/components/profile/PublicTitleGrid";
import { filterPublicTitleItems } from "@/lib/profile/filter-public-items";
import {
  getPublicProfileFavorites,
  isPublicApiError,
} from "@/services/public-profile";

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    q?: string;
    type?: string;
    sort?: string;
  }>;
};

export default async function PublicFavoritesPage({
  params,
  searchParams,
}: PageProps) {
  const { username } = await params;
  const filters = await searchParams;

  try {
    const favorites = await getPublicProfileFavorites(username);
    const filteredTitles = filterPublicTitleItems(
      favorites.titles ?? [],
      filters,
    );

    return (
      <PublicProfileSectionShell
        username={username}
        title={`@${username}'s Favorites`}
        description="Favorite titles and people this user chose to share."
      >
        <div className="space-y-8">
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Favorite Titles</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Movies and shows this user marked as favorites.
              </p>
            </div>
            <PublicProfileSectionFilters />
            <PublicTitleGrid
              items={filteredTitles as never[]}
              context="favorite"
              emptyText="No public favorite titles match these filters."
            />
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Favorite People</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Actors, creators, and people this user marked as favorites.
              </p>
            </div>
            <PublicPersonGrid
              items={(favorites.people ?? []) as never[]}
              emptyText="No public favorite people yet."
            />
          </section>
        </div>
      </PublicProfileSectionShell>
    );
  } catch (error) {
    if (isPublicApiError(error, 403)) {
      return (
        <PublicProfileSectionShell
          username={username}
          title={`@${username}'s Favorites`}
          description="Favorite titles and people this user chose to share."
          isPrivate
        />
      );
    }
    notFound();
  }
}
