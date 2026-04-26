import { TitleBrowseClient } from "@/components/browse/title-browse-client";

export default function MoviesPage() {
  return (
    <TitleBrowseClient
      mediaType="movie"
      title="Movies"
      description="Browse movies in the Simcine catalog."
    />
  );
}