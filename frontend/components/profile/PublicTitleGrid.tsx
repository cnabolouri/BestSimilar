import { PublicTitlePreviewCard } from "@/components/profile/PublicTitlePreviewCard";

type FlatTitleItem = {
  title?: {
    slug?: string;
  };
  title_slug?: string;
  title_name?: string;
  poster_url?: string;
  media_type?: string;
  rating?: number;
  review?: string;
};

type PublicTitleGridProps = {
  items: FlatTitleItem[];
  context?: "watchlist" | "favorite" | "rating" | "history";
  emptyText: string;
};

export function PublicTitleGrid({ items, context, emptyText }: PublicTitleGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
      {items.map((item, index) => (
        <PublicTitlePreviewCard
          key={item.title?.slug ?? item.title_slug ?? index}
          item={item}
          context={context}
        />
      ))}
    </div>
  );
}
