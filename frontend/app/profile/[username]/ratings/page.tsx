import { notFound } from "next/navigation";
import { PublicProfileSectionFilters } from "@/components/profile/PublicProfileSectionFilters";
import { PublicProfileSectionShell } from "@/components/profile/PublicProfileSectionShell";
import { PublicTitleGrid } from "@/components/profile/PublicTitleGrid";
import { filterPublicTitleItems } from "@/lib/profile/filter-public-items";
import {
  getPublicProfileRatings,
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

export default async function PublicRatingsPage({
  params,
  searchParams,
}: PageProps) {
  const { username } = await params;
  const filters = await searchParams;

  try {
    const ratings = await getPublicProfileRatings(username);
    const filteredRatings = filterPublicTitleItems(ratings, filters);

    return (
      <PublicProfileSectionShell
        username={username}
        title={`@${username}'s Ratings`}
        description="Titles this user rated publicly."
      >
        <PublicProfileSectionFilters showRatingSort />
        <PublicTitleGrid
          items={filteredRatings as never[]}
          context="rating"
          emptyText="No public ratings match these filters."
        />
      </PublicProfileSectionShell>
    );
  } catch (error) {
    if (isPublicApiError(error, 403)) {
      return (
        <PublicProfileSectionShell
          username={username}
          title={`@${username}'s Ratings`}
          description="Titles this user rated publicly."
          isPrivate
        />
      );
    }
    notFound();
  }
}
