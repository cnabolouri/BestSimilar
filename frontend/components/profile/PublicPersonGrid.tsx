import { PublicPersonPreviewCard } from "@/components/profile/PublicPersonPreviewCard";

type FlatPersonItem = {
  person?: {
    slug?: string;
  };
  person_slug?: string;
  person_name?: string;
  profile_url?: string;
  known_for_department?: string;
};

type PublicPersonGridProps = {
  items: FlatPersonItem[];
  emptyText: string;
};

export function PublicPersonGrid({ items, emptyText }: PublicPersonGridProps) {
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
        <PublicPersonPreviewCard
          key={item.person?.slug ?? item.person_slug ?? index}
          item={item}
        />
      ))}
    </div>
  );
}
