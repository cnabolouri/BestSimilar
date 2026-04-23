import type { DiscoverResponse } from "@/types/discover";
import { RichDiscoverResultCard } from "@/components/results/rich-discover-result-card";

export function DiscoverResultsGrid({ data }: { data: DiscoverResponse }) {
  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Results
        </h2>
        <span className="text-xs text-muted-foreground">{data.count} matches</span>
      </div>

      <div className="space-y-4">
        {data.results.map((item) => (
          <RichDiscoverResultCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}