import type { PersonDetail } from "@/types/person";

export function PersonFactsGrid({ person }: { person: PersonDetail }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {person.known_for_department ? (
        <FactCard label="Known for" value={person.known_for_department} />
      ) : null}
      {person.birthday ? <FactCard label="Born" value={person.birthday} /> : null}
      {person.deathday ? <FactCard label="Died" value={person.deathday} /> : null}
      {person.place_of_birth ? <FactCard label="Place of birth" value={person.place_of_birth} /> : null}
      <FactCard label="Popularity" value={String(person.popularity)} />
      <FactCard label="Credits" value={String(person.credits.length)} />
    </div>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}