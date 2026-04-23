import type { SimilarTitle, TitleDetail } from "@/types/title";
import { TitleHero } from "@/components/title/title-hero";
import { TitleCreditsGrid } from "@/components/title/title-credits-grid";
import { TitleSimilarGrid } from "@/components/title/title-similar-grid";
import { TitleFactsGrid } from "@/components/title/title-facts-grid";
import { TitleWatchProviders } from "@/components/title/title-watch-providers";
import { TitleNewsSection } from "@/components/title/title-news-section";

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

      <section className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {title.overview || "Overview coming soon."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Quick facts</h2>
            <div className="mt-4">
              <TitleFactsGrid title={title} />
            </div>
          </section>

          {(title.keywords.length > 0 || title.themes.length > 0 || title.genres.length > 0) ? (
            <section>
              <h2 className="text-lg font-semibold">Why it stands out</h2>

              {title.genres.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Genres
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {title.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full border border-border bg-chip px-3 py-1.5 text-xs text-muted-foreground"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {title.keywords.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Keywords
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {title.keywords.slice(0, 14).map((keyword) => (
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

              {title.themes.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Themes
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {title.themes.map((theme) => (
                      <span
                        key={theme.id}
                        className="rounded-full border border-border bg-chip px-3 py-1.5 text-xs text-muted-foreground"
                      >
                        {theme.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          <TitleWatchProviders />
          <TitleNewsSection />
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