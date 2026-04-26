import { TitleBrowseClient } from "@/components/browse/title-browse-client";

export default function TVPage() {
  return (
    <TitleBrowseClient
      mediaType="tv"
      title="TV Shows"
      description="Browse TV shows in the Simcine catalog."
    />
  );
}