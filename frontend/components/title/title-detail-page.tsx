import type { SimilarTitle, TitleDetail } from "@/types/title";
import { TitleHero } from "@/components/title/title-hero";
import { TitleCreditsGrid } from "@/components/title/title-credits-grid";
import { TitleSimilarGrid } from "@/components/title/title-similar-grid";

export function TitleDetailPage({
  title,
  similar,
}: {
  title: TitleDetail;
  similar: SimilarTitle[];
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      <TitleHero title={title} />

      <section className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            {title.overview || "Overview coming soon."}
          </p>

          {title.keywords.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Keywords</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {title.keywords.slice(0, 12).map((keyword) => (
                  <span
                    key={keyword.id}
                    className="rounded-full border border-border bg-chip px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {keyword.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <TitleCreditsGrid credits={title.credits} />
        </div>
      </section>

      <section className="mt-12">
        <TitleSimilarGrid items={similar} />
      </section>
    </div>
  );
}