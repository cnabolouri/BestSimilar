import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Eye,
  MonitorCog,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserRound,
} from "lucide-react";
import { SettingsMenuCard } from "@/components/profile/SettingsMenuCard";
import { getCurrentProfileServer } from "@/services/server-profile";

export default async function ProfileSettingsPage() {
  let profile;

  try {
    profile = await getCurrentProfileServer();
  } catch {
    redirect(`/login?next=${encodeURIComponent("/profile/settings")}`);
  }

  const username = profile.username_slug || profile.username;
  const publicProfileHref = username ? `/profile/${username}` : "/profile";
  const settings = [
    {
      title: "Personal Info",
      href: "/profile/settings/personal-info",
      description:
        "Edit your display name, profile image, and bio shown on your public profile.",
      icon: UserRound,
    },
    {
      title: "Login & Security",
      href: "/profile/settings/login-security",
      description:
        "Change your username, email, password, and future sign-in options.",
      icon: ShieldCheck,
    },
    {
      title: "Privacy",
      href: "/profile/settings/privacy",
      description:
        "Choose which public profile sections others can see, including ratings, watchlist, favorites, and history.",
      icon: Shield,
    },
    {
      title: "Preferences",
      href: "/profile/settings/preferences",
      description:
        "Manage taste preferences such as genres, languages, providers, content ratings, and preferred formats.",
      icon: SlidersHorizontal,
    },
    {
      title: "Site Settings",
      href: "/profile/settings/site",
      description:
        "Customize theme behavior, layout density, autoplay, animations, and browsing experience.",
      icon: MonitorCog,
    },
    {
      title: "Delete Account",
      href: "/profile/settings/delete-account",
      description:
        "Export your data, clear activity, or permanently delete your Simcine account.",
      icon: Trash2,
      danger: true,
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Account Settings
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Manage your profile, login, privacy, preferences, site behavior,
                and account data from one place.
              </p>
            </div>
            <Link
              href={publicProfileHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <Eye className="h-4 w-4" />
              View Public Profile
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {settings.map((item) => (
            <SettingsMenuCard
              key={item.title}
              title={item.title}
              description={item.description}
              href={item.href}
              icon={item.icon}
              danger={item.danger}
            />
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <h2 className="text-lg font-semibold">Profile Access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your public profile page can always be found at:
          </p>
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
            <code className="text-sm text-muted-foreground">
              /profile/{username || "username"}
            </code>
            <Link
              href={publicProfileHref}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
            >
              Open Public Profile
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Your profile page exists if your username exists, but your
            watchlist, favorites, ratings, reviews, and history only appear
            publicly if you enable them in Privacy settings.
          </p>
        </section>
      </div>
    </main>
  );
}
