import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { SettingsPanel } from "@/components/profile/SettingsPanel";

export default function PrivacySettingsPage() {
  return (
    <ProfileSettingsShell
      title="Privacy"
      description="Control what parts of your profile are visible to others."
    >
      <div className="space-y-5">
        <SettingsPanel
          title="Profile Visibility"
          description="Control which public profile sections other people can open."
        >
          <div className="mb-4 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            Your public profile is available at /profile/{"{username}"}. Your
            main profile page can be viewed if your username exists, but only
            the sections enabled below will be visible to others.
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Public watchlist",
                description: "Allow others to view /profile/{username}/watchlist.",
                defaultChecked: false,
              },
              {
                label: "Public favorite titles",
                description:
                  "Allow others to view your favorite titles on /profile/{username}/favorites.",
                defaultChecked: false,
              },
              {
                label: "Public favorite people",
                description:
                  "Allow others to view your favorite people on /profile/{username}/favorites.",
                defaultChecked: false,
              },
              {
                label: "Public ratings",
                description: "Allow others to view /profile/{username}/ratings.",
                defaultChecked: false,
              },
              {
                label: "Public reviews",
                description: "Allow others to view /profile/{username}/reviews.",
                defaultChecked: false,
              },
              {
                label: "Public watch history",
                description: "Allow others to view /profile/{username}/history.",
                defaultChecked: false,
              },
            ].map((item) => (
              <label
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="h-4 w-4"
                />
              </label>
            ))}
          </div>
        </SettingsPanel>
      </div>
    </ProfileSettingsShell>
  );
}
