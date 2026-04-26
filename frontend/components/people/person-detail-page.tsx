import Image from "next/image";
import type { PersonDetail, RelatedPerson } from "@/types/person";
import { PersonFactsGrid } from "@/components/people/person-facts-grid";
import { PersonGroupedCreditsGrid } from "@/components/people/person-grouped-credits-grid";
import { PersonNewsSection } from "@/components/people/person-news-section";
import { tmdbProfileUrl } from "@/lib/images";
import { PersonCareerScore } from "@/components/people/person-career-score";
import { PersonKnownForSection } from "@/components/people/person-known-for-section";
import { RelatedPeopleSection } from "@/components/people/related-people-section";
import { PersonGenreSummary } from "@/components/people/person-genre-summary";

export function PersonDetailPage({
  person,
  relatedPeople,
}: {
  person: PersonDetail;
  relatedPeople: RelatedPerson[];
}) {
  const profileUrl = tmdbProfileUrl(person.profile_url);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-border bg-background">
            {profileUrl ? (
              <Image src={profileUrl} alt={person.name} fill sizes="260px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-semibold text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {person.known_for_department || "Person"}
            </p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight">{person.name}</h1>

            {person.place_of_birth ? (
              <p className="mt-3 text-sm text-muted-foreground">{person.place_of_birth}</p>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {person.birthday ? (
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Born
                  </p>
                  <p className="mt-1 text-sm font-medium">{person.birthday}</p>
                </div>
              ) : null}

              {person.place_of_birth ? (
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Birthplace
                  </p>
                  <p className="mt-1 text-sm font-medium">{person.place_of_birth}</p>
                </div>
              ) : null}

              {person.known_for_department ? (
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Known for
                  </p>
                  <p className="mt-1 text-sm font-medium">{person.known_for_department}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Biography</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                {person.biography || "Biography information is not available yet."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <PersonKnownForSection credits={person.credits} />

      <section className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold">Quick facts</h2>
            <PersonCareerScore credits={person.credits} />
            <PersonGenreSummary credits={person.credits} />
            <PersonNewsSection newsItems={person.news_items} />
            <div className="mt-4">
              <PersonFactsGrid person={person} />
            </div>
          </section>

          <PersonNewsSection newsItems={person.news_items} />
        </div>

        <section>
          <PersonGroupedCreditsGrid credits={person.credits} />
        </section>
      </section>

      <RelatedPeopleSection people={relatedPeople} />
    </div>
  );
}