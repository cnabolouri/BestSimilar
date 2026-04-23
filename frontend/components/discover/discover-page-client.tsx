"use client";

import { useState } from "react";
import { discoverTitles } from "@/services/discover";
import type { DiscoverResponse } from "@/types/discover";
import { DiscoverResultsGrid } from "@/components/discover/discover-results-grid";

export function DiscoverPageClient() {
  const [prompt, setPrompt] = useState("");
  const [mediaType, setMediaType] = useState<"movie" | "tv">("tv");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiscoverResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDiscover() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await discoverTitles({
        prompt: prompt.trim(),
        media_type: mediaType,
        limit: 12,
      });
      setData(response);
    } catch {
      setError("Discovery failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Discover</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Describe a tone, mood, theme, or type of story and Simcine will surface semantically similar titles.
        </p>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A workplace comedy like The Office, but a little more emotional and family-focused..."
          className="min-h-[140px] w-full resize-none rounded-2xl border border-transparent bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex rounded-full border border-border bg-background p-1">
            {(["tv", "movie"] as const).map((value) => {
              const active = mediaType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMediaType(value)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {value === "tv" ? "TV Shows" : "Movies"}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleDiscover}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Discovering..." : "Discover"}
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
      {data ? <DiscoverResultsGrid data={data} /> : null}
    </div>
  );
}