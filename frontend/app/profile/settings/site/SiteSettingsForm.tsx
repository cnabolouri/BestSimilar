"use client";

import { useEffect, useState } from "react";
import { SettingsPanel } from "@/components/profile/SettingsPanel";
import { useUserSettings } from "@/components/settings/UserSettingsProvider";
import {
  getSiteSettings,
  type SiteSettings,
  updateSiteSettings,
} from "@/services/profile";

const defaultSettings: SiteSettings = {
  theme: "system",
  compact_cards: false,
  autoplay_trailers: false,
  reduce_animations: false,
};

export function SiteSettingsForm() {
  const { refreshSiteSettings } = useUserSettings();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load site settings.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const saved = await updateSiteSettings(settings);
      setSettings(saved);
      await refreshSiteSettings();
      setMessage("Site settings updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save site settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SettingsPanel title="Site Settings">
        <p className="text-sm text-muted-foreground">Loading site settings...</p>
      </SettingsPanel>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SettingsPanel
        title="Appearance"
        description="Choose how Simcine should look on this account."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { value: "system", label: "System", desc: "Follow device setting" },
            { value: "light", label: "Light", desc: "Use light mode" },
            { value: "dark", label: "Dark", desc: "Use dark mode" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                update("theme", item.value as SiteSettings["theme"])
              }
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                settings.theme === item.value
                  ? "border-foreground bg-muted"
                  : "border-border bg-background hover:bg-muted/40"
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {item.desc}
              </span>
            </button>
          ))}
        </div>
      </SettingsPanel>

      <SettingsPanel
        title="Browsing Experience"
        description="Adjust how cards and previews behave across the site."
      >
        <div className="space-y-4">
          <ToggleRow
            label="Compact cards"
            description="Show more results on each page."
            checked={settings.compact_cards}
            onChange={() => update("compact_cards", !settings.compact_cards)}
          />
          <ToggleRow
            label="Autoplay trailers"
            description="Automatically preview trailers where available."
            checked={settings.autoplay_trailers}
            onChange={() =>
              update("autoplay_trailers", !settings.autoplay_trailers)
            }
          />
          <ToggleRow
            label="Reduce animations"
            description="Use simpler transitions and hover effects."
            checked={settings.reduce_animations}
            onChange={() =>
              update("reduce_animations", !settings.reduce_animations)
            }
          />
        </div>
      </SettingsPanel>

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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Site Settings"}
        </button>
      </div>
    </form>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4"
      />
    </label>
  );
}
