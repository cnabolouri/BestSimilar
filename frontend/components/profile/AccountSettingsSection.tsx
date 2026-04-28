import Link from "next/link";
import {
  ChevronRight,
  MonitorCog,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserRound,
} from "lucide-react";

export function AccountSettingsSection() {
  const settings = [
    {
      label: "Personal Info",
      href: "/profile/settings/personal-info",
      description: "Edit your display name, profile image, and bio.",
      icon: UserRound,
    },
    {
      label: "Login & Security",
      href: "/profile/settings/login-security",
      description: "Change your username, email, password, and sign-in options.",
      icon: ShieldCheck,
    },
    {
      label: "Privacy",
      href: "/profile/settings/privacy",
      description: "Control what others can see on your profile.",
      icon: Shield,
    },
    {
      label: "Preferences",
      href: "/profile/settings/preferences",
      description: "Genres, languages, countries, and streaming services.",
      icon: SlidersHorizontal,
    },
    {
      label: "Site Settings",
      href: "/profile/settings/site",
      description: "Theme, layout density, autoplay, and display options.",
      icon: MonitorCog,
    },
    {
      label: "Delete Account",
      href: "/profile/settings/delete-account",
      description: "Export data or permanently delete your account.",
      icon: Trash2,
      danger: true,
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Account Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, privacy, preferences, and account.
        </p>
      </div>

      <div className="grid gap-3">
        {settings.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.label} href={item.href}>
              <div
                className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                  item.danger
                    ? "border-destructive/30 bg-destructive/10 hover:bg-destructive/15"
                    : "border-border bg-background hover:bg-muted/40"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    item.danger
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`font-medium ${
                      item.danger ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </h3>

                  <p
                    className={`mt-1 line-clamp-2 text-sm ${
                      item.danger
                        ? "text-destructive/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <ChevronRight
                  className={`h-4 w-4 shrink-0 ${
                    item.danger ? "text-destructive/70" : "text-muted-foreground"
                  }`}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
