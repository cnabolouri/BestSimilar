import { getSimilarTitles, getTitleDetail } from "@/services/titles";
import { TitleDetailPage } from "@/components/title/title-detail-page";
import { TVEpisodesPreview } from "@/components/tv/TVEpisodesPreview";

export default async function TvDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [title, similar] = await Promise.all([
    getTitleDetail(slug),
    getSimilarTitles(slug, 12),
  ]);

  return (
    <TitleDetailPage
      title={title}
      similar={similar.results}
      episodesSlot={<TVEpisodesPreview slug={slug} />}
    />
  );
}
