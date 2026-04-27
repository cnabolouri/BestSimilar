"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  removeFavoritePerson,
  type FavoritePersonItem,
} from "@/services/interactions";
import { tmdbProfileUrl } from "@/lib/images";

export function FavoritePeopleClient({ items }: { items: FavoritePersonItem[] }) {
  const [people, setPeople] = useState(items);

  async function handleRemove(person: FavoritePersonItem) {
    await removeFavoritePerson(person.person_slug);
    setPeople((current) =>
      current.filter((item) => item.person_slug !== person.person_slug)
    );
  }

  if (people.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-sm text-muted-foreground">
        No favorite people saved yet.
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">Favorite people</h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {people.map((person) => {
          const profileUrl = tmdbProfileUrl(person.profile_url);

          return (
            <div
              key={person.id}
              className="rounded-3xl border border-border bg-card p-3"
            >
              <Link href={`/person/${person.person_slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-background">
                  {profileUrl ? (
                    <Image
                      src={profileUrl}
                      alt={person.person_name}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <h3 className="mt-3 line-clamp-2 text-sm font-semibold">
                  {person.person_name}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {person.known_for_department || "Person"}
                </p>
              </Link>

              <button
                onClick={() => handleRemove(person)}
                className="mt-3 w-full rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-red-400 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}