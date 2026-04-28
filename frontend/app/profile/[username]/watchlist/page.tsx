import { notFound } from "next/navigation";
import { PublicProfileSectionFilters } from "@/components/profile/PublicProfileSectionFilters";
import { PublicProfileSectionShell } from "@/components/profile/PublicProfileSectionShell";
import { PublicTitleGrid } from "@/components/profile/PublicTitleGrid";
import { filterPublicTitleItems } from "@/lib/profile/filter-public-items";
import {
  getPublicProfileWatchlist,
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

export default async function PublicWatchlistPage({
  params,
  searchParams,
}: PageProps) {
  const { username } = await params;
  const filters = await searchParams;

  try {
    const items = await getPublicProfileWatchlist(username);
    const filteredItems = filterPublicTitleItems(items, filters);

    return (
      <PublicProfileSectionShell
        username={username}
        title={`@${username}'s Watchlist`}
        description="Titles this user wants to watch."
      >
        <PublicProfileSectionFilters />
        <PublicTitleGrid
          items={filteredItems as never[]}
          context="watchlist"
          emptyText="No public watchlist items match these filters."
        />
      </PublicProfileSectionShell>
    );
  } catch (error) {
    if (isPublicApiError(error, 403)) {
      return (
        <PublicProfileSectionShell
          username={username}
          title={`@${username}'s Watchlist`}
          description="Titles this user wants to watch."
          isPrivate
        />
      );
    }
    notFound();
  }
}
