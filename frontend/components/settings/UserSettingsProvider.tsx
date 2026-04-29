"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getSiteSettings,
  type SiteSettings,
  updateSiteSettings,
} from "@/services/profile";

type UserSettingsContextValue = {
  siteSettings: SiteSettings;
  loading: boolean;
  updateSiteSetting: <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) => Promise<void>;
  refreshSiteSettings: () => Promise<void>;
};

const fallbackSettings: SiteSettings = {
  theme: "system",
  compact_cards: false,
  autoplay_trailers: false,
  reduce_animations: false,
};

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null);

export function UserSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(fallbackSettings);
  const [loading, setLoading] = useState(true);

  async function refreshSiteSettings() {
    try {
      const settings = await getSiteSettings();
      setSiteSettings(settings);
      applyTheme(settings.theme);
      applyUiFlags(settings);
    } catch {
      setSiteSettings(fallbackSettings);
      applyTheme(fallbackSettings.theme);
      applyUiFlags(fallbackSettings);
    } finally {
      setLoading(false);
    }
  }

  async function updateSiteSetting<K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) {
    const previous = siteSettings;
    const next = {
      ...siteSettings,
      [key]: value,
    };

    setSiteSettings(next);
    applyTheme(next.theme);
    applyUiFlags(next);

    try {
      const saved = await updateSiteSettings(next);
      setSiteSettings(saved);
      applyTheme(saved.theme);
      applyUiFlags(saved);
    } catch (error) {
      setSiteSettings(previous);
      applyTheme(previous.theme);
      applyUiFlags(previous);
      throw error;
    }
  }

  useEffect(() => {
    refreshSiteSettings();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    function handleSystemThemeChange() {
      const currentTheme = siteSettings.theme;
      if (currentTheme === "system") {
        applyTheme("system");
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
    // Initial load should run once; explicit setting changes call applyTheme.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      siteSettings,
      loading,
      updateSiteSetting,
      refreshSiteSettings,
    }),
    [siteSettings, loading],
  );

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error("useUserSettings must be used inside UserSettingsProvider");
  }
  return context;
}

function applyTheme(theme: SiteSettings["theme"]) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(prefersDark ? "dark" : "light");
    return;
  }

  root.classList.add(theme);
}

function applyUiFlags(settings: SiteSettings) {
  const root = document.documentElement;
  root.dataset.compactCards = settings.compact_cards ? "true" : "false";
  root.dataset.reduceAnimations = settings.reduce_animations ? "true" : "false";
  root.dataset.autoplayTrailers = settings.autoplay_trailers ? "true" : "false";
}
