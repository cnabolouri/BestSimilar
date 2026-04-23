"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { searchAll } from "@/services/search";
import { discoverTitles } from "@/services/discover";
import type { UnifiedSearchResponse } from "@/types/search";
import type { DiscoverResponse } from "@/types/discover";
import { SearchTitleCard } from "@/components/cards/search-title-card";
import { SearchPersonCard } from "@/components/cards/search-person-card";
import { DiscoverResultCard } from "@/components/cards/discover-result-card";
import { PromptChipRow } from "@/components/home/prompt-chip-row";

import { SearchTitleCardSkeleton } from "@/components/cards/search-title-card-skeleton";
import { SearchPersonCardSkeleton } from "@/components/cards/search-person-card-skeleton";
import { DiscoverResultCardSkeleton } from "@/components/cards/discover-result-card-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

import Link from "next/link";

const tabs = [
  { id: "title", label: "Title Search" },
  { id: "discover", label: "AI Discover" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function SearchDiscoverTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("discover");
  const [searchInput, setSearchInput] = useState("");
  const [discoverInput, setDiscoverInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UnifiedSearchResponse | null>(null);
  const [discoverResults, setDiscoverResults] = useState<DiscoverResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const discoverTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  async function handleSearch() {
    if (!searchInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchAll(searchInput.trim(), 6);
      setSearchResults(data);
      setDiscoverResults(null);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDiscover() {
    if (!discoverInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await discoverTitles({
        prompt: discoverInput.trim(),
        media_type: "tv",
        limit: 8,
      });
      setDiscoverResults(data);
      setSearchResults(null);
    } catch {
      setError("Discovery failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handlePromptSelect(prompt: string) {
    setActiveTab("discover");
    setDiscoverInput(prompt);
    setSearchResults(null);
    setError(null);

    requestAnimationFrame(() => {
      discoverTextareaRef.current?.focus();
    });
  }

  return (
    <div className="w-full">
      <div className="inline-flex rounded-full border border-border bg-card p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative rounded-full px-4 py-2 text-sm font-medium"
            >
              {isActive ? (
                <motion.span
                  layoutId="simcine-tab-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              ) : null}

              <span
                className={[
                  "relative z-10 transition-colors",
                  isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-[2rem] border border-border bg-card p-3 shadow-sm">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "discover" ? (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              <textarea
                ref={discoverTextareaRef}
                rows={3}
                value={discoverInput}
                onChange={(e) => setDiscoverInput(e.target.value)}
                placeholder="Describe the kind of movie or show you want..."
                className="min-h-[92px] w-full resize-none rounded-2xl border border-transparent bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />

              <motion.button
                type="button"
                onClick={handleDiscover}
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Discovering..." : "Discover"}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, movie, show, or person..."
                className="h-14 w-full rounded-2xl border border-transparent bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
              />

              <motion.button
                type="button"
                onClick={handleSearch}
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Searching..." : "Search"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PromptChipRow onSelectPrompt={handlePromptSelect} />

            {error ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </motion.div>
      ) : null}

      {loading && activeTab === "title" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-8"
        >
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Titles
              </h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SearchTitleCardSkeleton key={i} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                People
              </h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SearchPersonCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}

      {loading && activeTab === "discover" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Discover results
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <DiscoverResultCardSkeleton key={i} />
            ))}
          </div>
        </motion.div>
      ) : null}

      <AnimatePresence mode="wait">
        {!loading && searchResults ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="mt-8 space-y-8"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Titles
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {searchResults.titles_count} results
                  </span>
                  <Link
                    href={`/search?q=${encodeURIComponent(searchResults.query)}`}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    View full search page
                  </Link>
                </div>
              </div>

              {searchResults.titles.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {searchResults.titles.map((item) => (
                    <SearchTitleCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No title matches found"
                  description="Try another title, a broader phrase, or check the spelling."
                />
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  People
                </h3>
                <span className="text-xs text-muted-foreground">
                  {searchResults.people_count} results
                </span>
              </div>

              {searchResults.people.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {searchResults.people.map((item) => (
                    <SearchPersonCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No people found"
                  description="Try another name or search by a title instead."
                />
              )}
            </div>
          </motion.div>
        ) : null}

        {!loading && discoverResults ? (
          <motion.div
            key="discover-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="mt-8"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Discover results
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {discoverResults.count} results
                </span>
                <Link
                  href={`/discover?prompt=${encodeURIComponent(discoverResults.prompt)}&media_type=${discoverResults.media_type ?? "tv"}`}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Open Discover page
                </Link>
              </div>
            </div>

            {discoverResults.results.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {discoverResults.results.map((item) => (
                  <DiscoverResultCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No close matches found"
                description="Try describing genre, tone, pacing, setting, or emotional feel."
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}