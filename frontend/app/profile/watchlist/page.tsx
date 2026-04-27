import { SavedTitlesPageClient } from "@/components/profile/saved-titles-page-client";

export default function WatchlistPage() {
  return (
    <SavedTitlesPageClient
      title="Your watchlist"
      description="Movies and shows you saved to watch later."
      type="watchlist"
    />
  );
}