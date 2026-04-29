import Link from "next/link";
import type { UnifiedSearchResponse } from "@/types/search";
import type { PublicProfile } from "@/services/public-profile";
import { SearchPersonCard } from "@/components/cards/search-person-card";
import { RichSearchResultCard } from "@/components/results/rich-search-result-card";

export function UnifiedSearchResults({
  data,
  profiles = [],
  searchType = "all",
}: {
  data: UnifiedSearchResponse;
  profiles?: PublicProfile[];
  searchType?: string;
}) {
  const showTitles = searchType === "all" || searchType === "titles";
  const showPeople = searchType === "all" || searchType === "people";
  const showProfiles =
    profiles.length > 0 && (searchType === "all" || searchType === "profiles");

  return (
    <div className="mt-8 space-y-10">
      {showTitles ? (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Titles
            </h2>
            <span className="text-xs text-muted-foreground">
              {data.titles_count} results
            </span>
          </div>

          <div className="space-y-4">
            {data.titles.map((item) => (
              <RichSearchResultCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {showPeople ? (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              People
            </h2>
            <span className="text-xs text-muted-foreground">
              {data.people_count} results
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.people.map((item) => (
              <SearchPersonCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {showProfiles ? (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Profiles
            </h2>
            <span className="text-xs text-muted-foreground">
              {profiles.length} results
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => {
              const username = profile.username_slug || profile.username;
              const displayName = profile.display_name || profile.username;

              return (
                <Link
                  key={username}
                  href={`/profile/${username}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm transition hover:bg-muted/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-sm font-semibold">
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      displayName.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">{displayName}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      @{username}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
