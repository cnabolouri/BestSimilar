"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getFavoritePeople,
  getFavoriteTitles,
  type FavoritePersonItem,
  type SavedTitleItem,
} from "@/services/interactions";
import { getCurrentProfile } from "@/services/profile";
import { SavedTitlesClient } from "@/components/profile/saved-titles-client";
import { FavoritePeopleClient } from "@/components/profile/favorite-people-client";

type Tab = "all" | "titles" | "people";

export function FavoritesPageClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [titles, setTitles] = useState<SavedTitleItem[]>([]);
  const [people, setPeople] = useState<FavoritePersonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await getCurrentProfile();
      } catch {
        router.replace(`/login?next=${encodeURIComponent("/profile/favorites")}`);
        return;
      }

      try {
        const [titleData, peopleData] = await Promise.all([
          getFavoriteTitles(),
          getFavoritePeople(),
        ]);
        setTitles(titleData);
        setPeople(peopleData);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const showTitles = tab === "all" || tab === "titles";
  const showPeople = tab === "all" || tab === "people";

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
        <p className="text-sm text-muted-foreground">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Your favorites</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Movies, shows, and people you marked as favorites.
        </p>
      </div>

      <div className="mb-8 inline-flex rounded-full border border-border bg-card p-1">
        {[
          { label: "All", value: "all" },
          { label: "Titles", value: "titles" },
          { label: "People", value: "people" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setTab(item.value as Tab)}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition",
              tab === item.value
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>

      {showTitles ? (
        <SavedTitlesClient
          title=""
          description=""
          items={titles}
          type="favorites"
          compactHeader
        />
      ) : null}

      {showPeople ? <FavoritePeopleClient items={people} /> : null}
    </div>
  );
}
