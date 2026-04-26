import type { PersonNewsItem } from "@/types/person";

function formatNewsDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PersonNewsSection({
  newsItems,
}: {
  newsItems: PersonNewsItem[];
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Recent news</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Recent coverage and updates related to this person.
          </p>
        </div>

        <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Latest
        </span>
      </div>

      {newsItems.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
          No recent news has been added for this person yet.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {newsItems.slice(0, 4).map((item, index) => (
            <a
              key={`${item.url}-${index}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-border bg-background px-4 py-4 transition hover:border-accent/60 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{item.source_name}</span>
                {formatNewsDate(item.published_at) ? (
                  <>
                    <span>•</span>
                    <span>{formatNewsDate(item.published_at)}</span>
                  </>
                ) : null}
              </div>

              <h3 className="mt-2 text-sm font-semibold text-foreground">
                {item.headline}
              </h3>

              {item.summary ? (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.summary}
                </p>
              ) : null}

              <p className="mt-3 text-xs font-medium text-accent">
                Open source article
              </p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}