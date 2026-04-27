import { SavedTitlesPageClient } from "@/components/profile/saved-titles-page-client";

export default function HistoryPage() {
  return (
    <SavedTitlesPageClient
      title="Watch history"
      description="Movies and shows you marked as already watched."
      type="history"
    />
  );
}