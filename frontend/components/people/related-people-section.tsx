import Image from "next/image";
import Link from "next/link";
import type { RelatedPerson } from "@/types/person";
import { tmdbProfileUrl } from "@/lib/images";

export function RelatedPeopleSection({
  people,
}: {
  people: RelatedPerson[];
}) {
  return (
    <section className="mt-10 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Related people</h2>
        <span className="text-xs text-muted-foreground">{people.length} profiles</span>
      </div>

      {people.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No related people found yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((person) => {
            const profileUrl = tmdbProfileUrl(person.profile_url);

            return (
              <Link
                key={person.id}
                href={`/person/${person.slug}`}
                className="group rounded-3xl border border-border bg-background p-3 transition hover:border-accent/60 hover:shadow-sm"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card">
                  {profileUrl ? (
                    <Image
                      src={profileUrl}
                      alt={person.name}
                      fill
                      sizes="180px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <h3 className="mt-3 text-sm font-semibold group-hover:text-accent">
                  {person.name}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {person.known_for_department || "Person"}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {person.shared_titles_count} shared title
                  {person.shared_titles_count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}