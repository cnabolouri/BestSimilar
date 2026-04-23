import Link from "next/link";
import type { TitleCredit } from "@/types/title";

export function TitleCreditsGrid({ credits }: { credits: TitleCredit[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cast & Crew</h2>
        <span className="text-xs text-muted-foreground">{credits.length} entries</span>
      </div>

      <div className="grid gap-3">
        {credits.slice(0, 12).map((credit) => (
          <Link
            key={credit.id}
            href={`/person/${credit.person_slug}`}
            className="rounded-2xl border border-border bg-card px-4 py-3 transition hover:border-accent/60 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{credit.person_name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {credit.character_name || credit.job_name || credit.role_type}
                </p>
              </div>
              <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {credit.role_type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}