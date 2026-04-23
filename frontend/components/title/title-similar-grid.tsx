import { DiscoverResultCard } from "@/components/cards/discover-result-card";
import type { SimilarTitle } from "@/types/title";

export function TitleSimilarGrid({ items }: { items: SimilarTitle[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">More like this</h2>
        <span className="text-xs text-muted-foreground">{items.length} results</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.slice(0, 10).map((item) => (
          <DiscoverResultCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}