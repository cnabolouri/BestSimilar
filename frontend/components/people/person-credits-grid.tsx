import Link from "next/link";
import type { PersonCredit } from "@/types/person";

export function PersonCreditsGrid({ credits }: { credits: PersonCredit[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filmography</h2>
        <span className="text-xs text-muted-foreground">{credits.length} entries</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {credits.map((credit) => {
          const href =
            credit.title_media_type === "movie"
              ? `/movie/${credit.title_slug}`
              : `/tv/${credit.title_slug}`;

          return (
            <Link
              key={credit.id}
              href={href}
              className="rounded-2xl border border-border bg-card p-4 transition hover:border-accent/60 hover:shadow-sm"
            >
              <p className="text-sm font-semibold">{credit.title_name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {credit.character_name || credit.job_name || credit.role_type}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                {credit.title_media_type} • {credit.role_type}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}