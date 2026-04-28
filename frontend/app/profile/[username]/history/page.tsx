import { notFound } from "next/navigation";
import { PublicProfileSectionFilters } from "@/components/profile/PublicProfileSectionFilters";
import { PublicProfileSectionShell } from "@/components/profile/PublicProfileSectionShell";
import { PublicTitleGrid } from "@/components/profile/PublicTitleGrid";
import { filterPublicTitleItems } from "@/lib/profile/filter-public-items";
import {
  getPublicProfileHistory,
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

export default async function PublicHistoryPage({
  params,
  searchParams,
}: PageProps) {
  const { username } = await params;
  const filters = await searchParams;

  try {
    const history = await getPublicProfileHistory(username);
    const filteredHistory = filterPublicTitleItems(history, filters);

    return (
      <PublicProfileSectionShell
        username={username}
        title={`@${username}'s Watch History`}
        description="Titles this user has watched and made public."
      >
        <PublicProfileSectionFilters showHistorySort />
        <PublicTitleGrid
          items={filteredHistory as never[]}
          context="history"
          emptyText="No public watch history items match these filters."
        />
      </PublicProfileSectionShell>
    );
  } catch (error) {
    if (isPublicApiError(error, 403)) {
      return (
        <PublicProfileSectionShell
          username={username}
          title={`@${username}'s Watch History`}
          description="Titles this user has watched and made public."
          isPrivate
        />
      );
    }
    notFound();
  }
}
