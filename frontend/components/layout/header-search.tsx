"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


export function HeaderSearch({ onSearch }: { onSearch?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}&type=all`);
    setQuery("");
    onSearch?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center rounded-full border border-border bg-card px-3 py-1.5"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies, shows, people..."
        className="h-8 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
      />

      <button
        type="submit"
        className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}