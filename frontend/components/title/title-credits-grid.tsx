import Link from "next/link";
import type { TitleCredit } from "@/types/title";

export function TitleCreditsGrid({ credits }: { credits: TitleCredit[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Cast & Crew</h2>
      <div className="mt-4 grid gap-3">
        {credits.slice(0, 12).map((credit) => (
          <Link
            key={credit.id}
            href={`/person/${credit.person_slug}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 transition hover:border-accent"
          >
            <div>
              <p className="text-sm font-semibold">{credit.person_name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {credit.character_name || credit.job_name || credit.role_type}
              </p>
            </div>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">{credit.role_type}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}