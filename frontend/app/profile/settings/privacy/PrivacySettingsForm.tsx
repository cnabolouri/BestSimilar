"use client";

import { useEffect, useState } from "react";
import { SettingsPanel } from "@/components/profile/SettingsPanel";
import {
  getCurrentProfile,
  getPrivacySettings,
  type PrivacySettings,
  updatePrivacySettings,
} from "@/services/profile";

const PRIVACY_ITEMS: {
  key: keyof PrivacySettings;
  label: string;
  description: string;
}[] = [
  {
    key: "show_watchlist",
    label: "Public watchlist",
    description: "Allow others to view /profile/{username}/watchlist.",
  },
  {
    key: "show_favorite_titles",
    label: "Public favorite titles",
    description: "Allow others to view your favorite movies and shows.",
  },
  {
    key: "show_favorite_people",
    label: "Public favorite people",
    description: "Allow others to view your favorite actors, creators, and people.",
  },
  {
    key: "show_ratings",
    label: "Public ratings",
    description: "Allow others to view /profile/{username}/ratings.",
  },
  {
    key: "show_reviews",
    label: "Public reviews",
    description: "Allow others to view /profile/{username}/reviews.",
  },
  {
    key: "show_watch_history",
    label: "Public watch history",
    description: "Allow others to view /profile/{username}/history.",
  },
];

const EMPTY: PrivacySettings = {
  show_watchlist: false,
  show_favorite_titles: false,
  show_favorite_people: false,
  show_ratings: false,
  show_reviews: false,
  show_watch_history: false,
};

export function PrivacySettingsForm() {
  const [settings, setSettings] = useState<PrivacySettings>(EMPTY);
  const [username, setUsername] = useState("username");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPrivacySettings(), getCurrentProfile()])
      .then(([privacy, profile]) => {
        setSettings(privacy);
        setUsername(profile.username_slug || profile.username || "username");
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load privacy settings.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  function toggle(key: keyof PrivacySettings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const updated = await updatePrivacySettings(settings);
      setSettings(updated);
      setMessage("Privacy settings updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save privacy settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SettingsPanel title="Profile Visibility">
        <p className="text-sm text-muted-foreground">Loading privacy settings...</p>
      </SettingsPanel>
    );
  }

  return (
    <SettingsPanel
      title="Profile Visibility"
      description="Choose what other users can see when they visit your public profile."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Your public profile is available at{" "}
          <span className="font-medium text-foreground">/profile/{username}</span>.
          Only the sections enabled below will be visible to others.
        </div>

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

        {PRIVACY_ITEMS.map((item) => (
          <label
            key={item.key}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-background p-4"
          >
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.description.replace("{username}", username)}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings[item.key]}
              onChange={() => toggle(item.key)}
              className="h-4 w-4"
            />
          </label>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Privacy Settings"}
          </button>
        </div>
      </form>
    </SettingsPanel>
  );
}
