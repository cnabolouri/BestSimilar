import Image from "next/image";
import type { TitleWatchProvider } from "@/types/title";
import { tmdbLogoUrl } from "@/lib/images";

function groupProviders(providers: TitleWatchProvider[]) {
  return {
    flatrate: providers.filter((p) => p.provider_type === "flatrate"),
    free: providers.filter((p) => p.provider_type === "free"),
    rent: providers.filter((p) => p.provider_type === "rent"),
    buy: providers.filter((p) => p.provider_type === "buy"),
  };
}

export function TitleWatchProviders({
  providers,
}: {
  providers: TitleWatchProvider[];
}) {
  const grouped = groupProviders(providers);

  const sections = [
    { label: "Streaming", items: grouped.flatrate },
    { label: "Free", items: grouped.free },
    { label: "Rent", items: grouped.rent },
    { label: "Buy", items: grouped.buy },
  ].filter((section) => section.items.length > 0);

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Where to watch</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Available watch options for the US region.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Availability data powered by JustWatch via TMDB.
          </p>
        </div>

        <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          US
        </span>
      </div>

      {sections.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
          No watch-provider data is currently available for this title.
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {section.label}
              </h3>

              <div className="mt-3 flex flex-wrap gap-3">
                {section.items
                  .slice()
                  .sort((a, b) => a.display_priority - b.display_priority)
                  .map((provider) => {
                    const logo = tmdbLogoUrl(provider.logo_path);

                    const content = (
                      <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-2 transition hover:border-accent/60 hover:shadow-sm">
                        <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-border bg-card">
                          {logo ? (
                            <Image
                              src={logo}
                              alt={provider.provider_name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                              App
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {provider.provider_name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Open provider page
                          </p>
                        </div>
                      </div>
                    );

                    return provider.provider_link ? (
                      <a
                        key={`${provider.provider_type}-${provider.provider_id}`}
                        href={provider.provider_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={`${provider.provider_type}-${provider.provider_id}`}>
                        {content}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}