"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SettingsPanel } from "@/components/profile/SettingsPanel";
import { preferencesToDiscoverDefaults } from "@/lib/profile/preferences-to-query";
import {
  getTastePreferences,
  type TastePreferences,
  updateTastePreferences,
} from "@/services/profile";

const genreOptions = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const languageOptions = [
  "English",
  "Spanish",
  "French",
  "Korean",
  "Japanese",
  "Persian",
];

const providerOptions = [
  "Netflix",
  "Prime Video",
  "Hulu",
  "Max",
  "Disney+",
  "Apple TV+",
];

const defaultPreferences: TastePreferences = {
  preferred_format: "both",
  content_rating_preference: "any",
  favorite_genres: [],
  avoided_genres: [],
  preferred_languages: [],
  preferred_countries: [],
  preferred_providers: [],
};

export function PreferencesForm() {
  const [preferences, setPreferences] =
    useState<TastePreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const data = await getTastePreferences();
        setPreferences(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load preferences.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, []);

  function update<K extends keyof TastePreferences>(
    key: K,
    value: TastePreferences[K],
  ) {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleArrayValue(key: keyof TastePreferences, value: string) {
    const currentValue = preferences[key];
    if (!Array.isArray(currentValue)) return;

    const nextValue = currentValue.includes(value)
      ? currentValue.filter((item) => item !== value)
      : [...currentValue, value];

    update(key, nextValue as never);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const saved = await updateTastePreferences(preferences);
      setPreferences(saved);
      setMessage("Preferences updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save preferences.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SettingsPanel title="Taste Preferences">
        <p className="text-sm text-muted-foreground">Loading preferences...</p>
      </SettingsPanel>
    );
  }

  const discoverParams = preferencesToDiscoverDefaults(preferences);
  discoverParams.set("personalized", "true");

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SettingsPanel
        title="Content Preferences"
        description="Control the type of content you prefer to discover."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Preferred format</span>
            <select
              value={preferences.preferred_format}
              onChange={(event) =>
                update(
                  "preferred_format",
                  event.target.value as TastePreferences["preferred_format"],
                )
              }
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="both">Movies and TV</option>
              <option value="movies">Movies only</option>
              <option value="tv">TV only</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Content rating</span>
            <select
              value={preferences.content_rating_preference}
              onChange={(event) =>
                update(
                  "content_rating_preference",
                  event.target
                    .value as TastePreferences["content_rating_preference"],
                )
              }
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="any">Any rating</option>
              <option value="family">Family friendly</option>
              <option value="pg13">PG-13 and below</option>
              <option value="mature">R / mature allowed</option>
            </select>
          </label>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title="Taste Profile"
        description="These preferences can later improve personalized recommendations."
      >
        <div className="space-y-6">
          <ChipGroup
            title="Favorite Genres"
            items={genreOptions}
            selected={preferences.favorite_genres}
            onToggle={(value) => toggleArrayValue("favorite_genres", value)}
          />
          <ChipGroup
            title="Avoided Genres"
            items={genreOptions}
            selected={preferences.avoided_genres}
            onToggle={(value) => toggleArrayValue("avoided_genres", value)}
          />
          <ChipGroup
            title="Preferred Languages"
            items={languageOptions}
            selected={preferences.preferred_languages}
            onToggle={(value) => toggleArrayValue("preferred_languages", value)}
          />
          <ChipGroup
            title="Streaming Services"
            items={providerOptions}
            selected={preferences.preferred_providers}
            onToggle={(value) => toggleArrayValue("preferred_providers", value)}
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
        <Link
          href={`/discover?${discoverParams.toString()}`}
          className="mr-3 rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:bg-muted"
        >
          Discover with my preferences
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </form>
  );
}

function ChipGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selected.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
