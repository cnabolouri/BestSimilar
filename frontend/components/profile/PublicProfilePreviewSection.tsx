import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";

type PublicProfilePreviewSectionProps = {
  title: string;
  href: string;
  count?: number | null;
  isPublic: boolean;
  emptyText: string;
  children?: React.ReactNode;
};

export function PublicProfilePreviewSection({
  title,
  href,
  count,
  isPublic,
  emptyText,
  children,
}: PublicProfilePreviewSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          {typeof count === "number" ? (
            <span className="text-sm text-muted-foreground">{count}</span>
          ) : null}
        </div>

        {isPublic ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      {!isPublic ? (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          This section is private.
        </div>
      ) : children ? (
        children
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          {emptyText}
        </div>
      )}
    </section>
  );
}
