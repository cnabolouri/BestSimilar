import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { SettingsPanel } from "@/components/profile/SettingsPanel";

export default function LoginSecuritySettingsPage() {
  return (
    <ProfileSettingsShell
      title="Login & Security"
      description="Manage your username, email, password, and sign-in options."
    >
      <div className="space-y-5">
        <SettingsPanel
          title="Account Identity"
          description="Your username controls your public profile URL."
        >
          <form className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                defaultValue="sina"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
              />
              <p className="text-xs text-muted-foreground">
                Your public profile will be available at /profile/username.
              </p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                defaultValue="sina@example.com"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
              >
                Save Account Changes
              </button>
            </div>
          </form>
        </SettingsPanel>

        <SettingsPanel
          title="Password"
          description="Update your password to keep your account secure."
        >
          <form className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Current password</label>
              <input
                type="password"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">New password</label>
              <input
                type="password"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Confirm new password</label>
              <input
                type="password"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
              >
                Update Password
              </button>
            </div>
          </form>
        </SettingsPanel>
      </div>
    </ProfileSettingsShell>
  );
}
