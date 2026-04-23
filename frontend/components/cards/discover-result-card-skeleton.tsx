import { Skeleton } from "@/components/ui/skeleton";

export function DiscoverResultCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-3 h-3 w-1/3" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}