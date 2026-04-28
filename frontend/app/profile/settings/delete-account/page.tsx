import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { SettingsPanel } from "@/components/profile/SettingsPanel";

export default function DeleteAccountSettingsPage() {
  return (
    <ProfileSettingsShell
      title="Delete Account"
      description="Export your data, clear activity, or permanently delete your Simcine account."
      danger
    >
      <div className="space-y-5">
        <SettingsPanel
          title="Export Data"
          description="Download a copy of your profile, ratings, watchlist, favorites, and history."
        >
          <button
            type="button"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Export My Data
          </button>
        </SettingsPanel>

        <SettingsPanel
          title="Clear Activity"
          description="Remove specific parts of your activity without deleting your account."
          danger
        >
          <div className="flex flex-wrap gap-2">
            {["Clear history", "Clear ratings", "Clear favorites", "Clear watchlist"].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full border border-destructive/30 bg-background px-4 py-2 text-sm text-destructive transition hover:bg-destructive/10"
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </SettingsPanel>

        <SettingsPanel
          title="Permanently Delete Account"
          description="This action cannot be undone."
          danger
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deleting your account will remove your profile, ratings,
              favorites, watchlist, watch history, and preferences.
            </p>

            <button
              type="button"
              className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:opacity-90"
            >
              Delete Account
            </button>
          </div>
        </SettingsPanel>
      </div>
    </ProfileSettingsShell>
  );
}
