type CountItem = {
  name?: string;
  rating?: number;
  count: number;
};

type PublicProfileInsightsProps = {
  insights: {
    top_genres?: CountItem[];
    top_years?: CountItem[];
    rating_breakdown?: CountItem[];
  };
};

export function PublicProfileInsights({ insights }: PublicProfileInsightsProps) {
  const topGenres = insights.top_genres ?? [];
  const ratingBreakdown = insights.rating_breakdown ?? [];
  const hasInsights = topGenres.length > 0 || ratingBreakdown.length > 0;

  return (
    <aside className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
        <h2 className="text-lg font-semibold">Taste Insights</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on this user's public ratings, favorites, watchlist, and history.
        </p>
        {!hasInsights ? (
          <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Insights will appear once this user has enough public activity.
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {topGenres.length > 0 && (
              <InsightChips
                title="Favorite Genres"
                items={topGenres.map((item) => ({
                  label: item.name ?? "Unknown",
                  count: item.count,
                }))}
              />
            )}
            {ratingBreakdown.length > 0 && (
              <RatingBreakdown items={ratingBreakdown} />
            )}
          </div>
        )}
      </section>
    </aside>
  );
}

function InsightChips({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.slice(0, 8).map((item) => (
          <span
            key={item.label}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
          >
            {item.label}
            <span className="ml-1 text-foreground">{item.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function RatingBreakdown({ items }: { items: CountItem[] }) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div>
      <h3 className="text-sm font-semibold">Rating Pattern</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => {
          const width = `${Math.max((item.count / max) * 100, 8)}%`;

          return (
            <div
              key={item.rating}
              className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 text-xs"
            >
              <span className="text-muted-foreground">{item.rating}</span>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width }}
                />
              </div>
              <span className="text-right text-muted-foreground">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
