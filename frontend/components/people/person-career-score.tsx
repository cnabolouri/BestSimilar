import type { PersonCredit } from "@/types/person";

function calculateCareerScore(credits: PersonCredit[]) {
  const uniqueTitles = new Map<number, PersonCredit>();

  for (const credit of credits) {
    if (!uniqueTitles.has(credit.title_id)) {
      uniqueTitles.set(credit.title_id, credit);
    }
  }

  const titles = Array.from(uniqueTitles.values());

  if (titles.length === 0) return 0;

  const total = titles.reduce((sum, credit) => {
    const rating = credit.title_vote_average || 0;
    const voteWeight = Math.log10(Math.max(credit.title_vote_count, 1));
    const popularityWeight = Math.log10(Math.max(credit.title_popularity, 1));

    return sum + rating * 5 + voteWeight * 8 + popularityWeight * 3;
  }, 0);

  const rawScore = total / Math.sqrt(titles.length + 4);

  return Math.max(1, Math.min(99, Math.round(rawScore)));
}

export function PersonCareerScore({ credits }: { credits: PersonCredit[] }) {
  const score = calculateCareerScore(credits);

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Simcine career impact
      </p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight">{score}</span>
        <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Estimated from title ratings, vote counts, popularity, and known catalog credits.
      </p>
    </section>
  );
}