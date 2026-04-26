import type { PersonCredit } from "@/types/person";

function getTopGenres(credits: PersonCredit[]) {
  const counts = new Map<string, number>();

  for (const credit of credits) {
    for (const genre of credit.title_genres || []) {
      counts.set(genre, (counts.get(genre) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

export function PersonGenreSummary({ credits }: { credits: PersonCredit[] }) {
  const genres = getTopGenres(credits);

  if (genres.length === 0) return null;

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Common genres</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Genres this person appears in across the current Simcine catalog.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {genres.map(([genre, count]) => (
          <span
            key={genre}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
          >
            {genre} · {count}
          </span>
        ))}
      </div>
    </section>
  );
}