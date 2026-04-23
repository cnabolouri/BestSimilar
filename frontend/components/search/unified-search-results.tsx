import type { UnifiedSearchResponse } from "@/types/search";
import { SearchPersonCard } from "@/components/cards/search-person-card";
import { RichSearchResultCard } from "@/components/results/rich-search-result-card";

export function UnifiedSearchResults({ data }: { data: UnifiedSearchResponse }) {
  return (
    <div className="mt-8 space-y-10">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Titles
          </h2>
          <span className="text-xs text-muted-foreground">{data.titles_count} results</span>
        </div>

        <div className="space-y-4">
          {data.titles.map((item) => (
            <RichSearchResultCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            People
          </h2>
          <span className="text-xs text-muted-foreground">{data.people_count} results</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.people.map((item) => (
            <SearchPersonCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}