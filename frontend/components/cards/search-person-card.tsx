import Link from "next/link";
import type { SearchPerson } from "@/types/search";

export function SearchPersonCard({ item }: { item: SearchPerson }) {
  return (
    <Link
      href={`/person/${item.slug}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-accent"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] text-muted-foreground">
        Person
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{item.known_for_department || "Person"}</p>
      </div>
    </Link>
  );
}