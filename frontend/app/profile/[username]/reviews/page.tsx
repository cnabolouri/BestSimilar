import { notFound } from "next/navigation";
import { PublicProfileSectionFilters } from "@/components/profile/PublicProfileSectionFilters";
import { PublicProfileSectionShell } from "@/components/profile/PublicProfileSectionShell";
import { PublicTitleGrid } from "@/components/profile/PublicTitleGrid";
import { filterPublicTitleItems } from "@/lib/profile/filter-public-items";
import {
  getPublicProfileReviews,
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

export default async function PublicReviewsPage({
  params,
  searchParams,
}: PageProps) {
  const { username } = await params;
  const filters = await searchParams;

  try {
    const reviews = await getPublicProfileReviews(username);
    const filteredReviews = filterPublicTitleItems(reviews, filters);

    return (
      <PublicProfileSectionShell
        username={username}
        title={`@${username}'s Reviews`}
        description="Titles this user reviewed publicly."
      >
        <PublicProfileSectionFilters showRatingSort />
        <PublicTitleGrid
          items={filteredReviews as never[]}
          context="rating"
          emptyText="No public reviews match these filters."
        />
      </PublicProfileSectionShell>
    );
  } catch (error) {
    if (isPublicApiError(error, 403)) {
      return (
        <PublicProfileSectionShell
          username={username}
          title={`@${username}'s Reviews`}
          description="Titles this user reviewed publicly."
          isPrivate
        />
      );
    }
    notFound();
  }
}
