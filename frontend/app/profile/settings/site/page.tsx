import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { SettingsPanel } from "@/components/profile/SettingsPanel";

export default function SiteSettingsPage() {
  return (
    <ProfileSettingsShell
      title="Site Settings"
      description="Manage theme, layout density, autoplay, animations, and display options."
    >
      <div className="space-y-5">
        <SettingsPanel
          title="Appearance"
          description="Control how Simcine looks on your device."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {["System", "Light", "Dark"].map((theme) => (
              <button
                key={theme}
                type="button"
                className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition hover:bg-muted"
              >
                <span className="font-medium">{theme}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {theme === "System"
                    ? "Follow device setting"
                    : `Use ${theme.toLowerCase()} mode`}
                </span>
              </button>
            ))}
          </div>
        </SettingsPanel>

        <SettingsPanel
          title="Browsing Experience"
          description="Adjust how movie and TV cards behave across the site."
        >
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
              <div>
                <p className="text-sm font-medium">Compact cards</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Show more results on each page.
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
              <div>
                <p className="text-sm font-medium">Autoplay trailers</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Automatically preview trailers where available.
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
              <div>
                <p className="text-sm font-medium">Reduce animations</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use simpler transitions and hover effects.
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </label>
          </div>
        </SettingsPanel>
      </div>
    </ProfileSettingsShell>
  );
}
