import Image from "next/image";
import type { PersonDetail } from "@/types/person";
import { PersonCreditsGrid } from "@/components/people/person-credits-grid";
import { tmdbProfileUrl } from "@/lib/images";

export function PersonDetailPage({ person }: { person: PersonDetail }) {
  const profileUrl = tmdbProfileUrl(person.profile_url);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="grid gap-8 md:grid-cols-[180px_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-background">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={person.name}
                fill
                sizes="180px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-semibold text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {person.known_for_department || "Person"}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">{person.name}</h1>

            {person.place_of_birth ? (
              <p className="mt-3 text-sm text-muted-foreground">{person.place_of_birth}</p>
            ) : null}

            {person.biography ? (
              <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
                {person.biography}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <PersonCreditsGrid credits={person.credits} />
      </section>
    </div>
  );
}