"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsPanel } from "@/components/profile/SettingsPanel";
import { getCurrentProfile, updateCurrentProfile } from "@/services/profile";

export function PersonalInfoForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentProfile()
      .then((profile) => {
        setDisplayName(profile.display_name || "");
        setBio(profile.bio || "");
        setAvatarUrl(profile.avatar_url || "");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateCurrentProfile({ display_name: displayName, bio, avatar_url: avatarUrl });
      setMessage("Profile updated.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SettingsPanel title="Profile Details">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </SettingsPanel>
    );
  }

  return (
    <div className="space-y-5">
      <SettingsPanel
        title="Profile Details"
        description="This information appears on your public Simcine profile."
      >
        <form onSubmit={handleSubmit} className="grid gap-4">
          {message && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-300">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <label className="text-sm font-medium">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a little about your taste in movies and shows."
              className="resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Profile image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </SettingsPanel>

      <SettingsPanel
        title="Profile Image Preview"
        description="This is how your avatar will appear on your public profile."
      >
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted text-lg font-semibold">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName || "Profile image"}
                className="h-full w-full object-cover"
              />
            ) : (
              (displayName || "U").slice(0, 2).toUpperCase()
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Upload support can be added later. For now, paste an image URL.
          </p>
        </div>
      </SettingsPanel>
    </div>
  );
}
