import { ProfileSettingsShell } from "@/components/profile/ProfileSettingsShell";
import { SettingsPanel } from "@/components/profile/SettingsPanel";

export default function PersonalInfoSettingsPage() {
  return (
    <ProfileSettingsShell
      title="Personal Info"
      description="Edit your display name, profile image, and bio."
    >
      <div className="space-y-5">
        <SettingsPanel
          title="Profile Details"
          description="This information appears on your Simcine profile."
        >
          <form className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Display name</label>
              <input
                type="text"
                defaultValue="Sina Bolouri"
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                rows={4}
                defaultValue="Building a smarter way to discover movies and TV shows through similarity, taste, and meaning."
                className="resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </SettingsPanel>

        <SettingsPanel
          title="Profile Image"
          description="Upload or replace your profile image."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted text-lg font-semibold">
              SB
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:bg-muted"
              >
                Upload Image
              </button>

              <button
                type="button"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted"
              >
                Remove
              </button>
            </div>
          </div>
        </SettingsPanel>
      </div>
    </ProfileSettingsShell>
  );
}
