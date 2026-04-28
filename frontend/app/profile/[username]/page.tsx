import { notFound, redirect } from "next/navigation";
import { ProfileStatsGrid } from "@/components/profile/ProfileStatsGrid";
import { PublicPersonPreviewCard } from "@/components/profile/PublicPersonPreviewCard";
import { PublicProfileInsights } from "@/components/profile/PublicProfileInsights";
import { PublicProfilePreviewSection } from "@/components/profile/PublicProfilePreviewSection";
import { PublicTitlePreviewCard } from "@/components/profile/PublicTitlePreviewCard";
import {
  getPublicProfileOverview,
  type PublicProfileOverview,
} from "@/services/public-profile";
import { getCurrentProfileServer } from "@/services/server-profile";

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;

  // Redirect logged-in users viewing their own public profile to the private dashboard.
  let shouldRedirectToPrivateProfile = false;
  try {
    const me = await getCurrentProfileServer();
    const myUsername = me.username_slug || me.username;
    shouldRedirectToPrivateProfile =
      !!myUsername && myUsername.toLowerCase() === username.toLowerCase();
  } catch {
    // Not logged in — continue rendering the public profile.
  }

  if (shouldRedirectToPrivateProfile) {
    redirect("/profile");
  }

  let overview: PublicProfileOverview;

  try {
    overview = await getPublicProfileOverview(username);
  } catch {
    notFound();
  }

  const { profile, stats, visibility, previews, insights } = overview;
  const displayName = profile.display_name || profile.username;
  const initials =
    displayName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Profile header */}
        <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted text-2xl font-semibold">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                @{profile.username_slug || profile.username}
              </p>
              {profile.bio ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {profile.bio}
                </p>
              ) : null}
              {profile.member_since ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Member since{" "}
                  {new Date(profile.member_since).getFullYear().toString()}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <ProfileStatsGrid
          stats={{
            watchlist: stats.watchlist_count,
            favorites: stats.favorites_count,
            watched: stats.watched_count,
            ratings: stats.ratings_count,
            reviews: stats.reviews_count,
          }}
          basePath={`/profile/${username}`}
          mode="public"
          visibility={{
            watchlist: visibility.watchlist,
            favorites: visibility.favorite_titles || visibility.favorite_people,
            history: visibility.history,
            ratings: visibility.ratings,
            reviews: visibility.reviews,
          }}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-6">
            <PublicProfilePreviewSection
              title="Ratings"
              href={`/profile/${username}/ratings`}
              count={stats.ratings_count}
              isPublic={visibility.ratings}
              emptyText="No public ratings yet."
            >
              <TitlePreviewRow
                items={previews.ratings}
                context="rating"
                emptyText="No public ratings yet."
              />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Favorite Titles"
              href={`/profile/${username}/favorites`}
              count={stats.favorite_titles_count}
              isPublic={visibility.favorite_titles}
              emptyText="No public favorite titles yet."
            >
              <TitlePreviewRow
                items={previews.favorite_titles}
                context="favorite"
                emptyText="No public favorite titles yet."
              />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Favorite People"
              href={`/profile/${username}/favorites`}
              count={stats.favorite_people_count}
              isPublic={visibility.favorite_people}
              emptyText="No public favorite people yet."
            >
              <PersonPreviewRow
                items={previews.favorite_people}
                emptyText="No public favorite people yet."
              />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Watchlist"
              href={`/profile/${username}/watchlist`}
              count={stats.watchlist_count}
              isPublic={visibility.watchlist}
              emptyText="No public watchlist items yet."
            >
              <TitlePreviewRow
                items={previews.watchlist}
                context="watchlist"
                emptyText="No public watchlist items yet."
              />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Recently Watched"
              href={`/profile/${username}/history`}
              count={stats.watched_count}
              isPublic={visibility.history}
              emptyText="No public watch history yet."
            >
              <TitlePreviewRow
                items={previews.history}
                context="history"
                emptyText="No public watch history yet."
              />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Reviews"
              href={`/profile/${username}/reviews`}
              count={stats.reviews_count}
              isPublic={visibility.reviews}
              emptyText="No public reviews yet."
            >
              <TitlePreviewRow
                items={previews.reviews}
                context="rating"
                emptyText="No public reviews yet."
              />
            </PublicProfilePreviewSection>
          </div>

          <div className="flex flex-col gap-6">
            <PublicProfileInsights insights={insights} />
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Flat item types matching the existing interaction serializers ────────────

type FlatTitleItem = {
  title?: {
    slug?: string;
    title?: string;
    poster_url?: string;
    media_type?: string;
    release_year?: number | null;
    vote_average?: number | null;
  };
  title_slug?: string;
  title_name?: string;
  poster_url?: string;
  media_type?: string;
  rating?: number;
  review?: string;
};

type FlatPersonItem = {
  person?: {
    slug?: string;
    name?: string;
    profile_url?: string;
    known_for_department?: string;
  };
  person_slug?: string;
  person_name?: string;
  profile_url?: string;
  known_for_department?: string;
};

// ─── Row helpers ─────────────────────────────────────────────────────────────

function TitlePreviewRow({
  items,
  context,
  emptyText,
}: {
  items: FlatTitleItem[];
  context: "watchlist" | "favorite" | "rating" | "history";
  emptyText: string;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
      {items.slice(0, 8).map((item, index) => (
        <PublicTitlePreviewCard
          key={item.title?.slug ?? item.title_slug ?? index}
          item={item}
          context={context}
        />
      ))}
    </div>
  );
}

function PersonPreviewRow({
  items,
  emptyText,
}: {
  items: FlatPersonItem[];
  emptyText: string;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
      {items.slice(0, 8).map((item, index) => (
        <PublicPersonPreviewCard
          key={item.person?.slug ?? item.person_slug ?? index}
          item={item}
        />
      ))}
    </div>
  );
}
