import { redirect } from "next/navigation";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLibrarySection } from "@/components/profile/ProfileLibrarySection";
import { ProfileStatsGrid } from "@/components/profile/ProfileStatsGrid";
import {
  getCurrentProfileServer,
  getInteractionSummaryServer,
} from "@/services/server-profile";

export default async function ProfilePage() {
  let profile;
  let summary;

  try {
    [profile, summary] = await Promise.all([
      getCurrentProfileServer(),
      getInteractionSummaryServer(),
    ]);
  } catch {
    redirect("/login?next=/profile");
  }

  const user = {
    displayName: profile.display_name || profile.username || "User",
    username: profile.username_slug || profile.username || "user",
    bio:
      profile.bio ||
      "Manage your saved titles, ratings, history, and account settings.",
    memberSince: profile.date_joined
      ? new Date(profile.date_joined).getFullYear().toString()
      : "",
    avatarUrl: profile.avatar_url || null,
  };

  const stats = {
    watchlist: summary.watchlist_count,
    favorites: summary.favorites_count,
    watched: summary.watched_count,
    ratings: summary.ratings_count,
    reviews: summary.reviews_count,
  };

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <ProfileHeader user={user} />

        <ProfileStatsGrid stats={stats} basePath="/profile" mode="private" />

        <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <ProfileLibrarySection />
          <AccountSettingsSection />
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your latest ratings, watched titles, favorites, and saved items
                will appear here.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            No recent activity yet.
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Recommended For You</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Personalized recommendations will improve as you rate, favorite,
              and watch more titles.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Start rating or saving titles to unlock better recommendations.
          </div>
        </section>
      </div>
    </main>
  );
}
