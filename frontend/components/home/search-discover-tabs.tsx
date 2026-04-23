// "use client";

// import { useState } from "react";

// const tabs = [
//   { id: "title", label: "Title Search" },
//   { id: "discover", label: "AI Discover" },
// ] as const;

// export function SearchDiscoverTabs() {
//   const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("discover");

//   return (
//     <div className="w-full">
//       <div className="inline-flex rounded-full border border-border bg-card p-1">
//         {tabs.map((tab) => {
//           const isActive = activeTab === tab.id;
//           return (
//             <button
//               key={tab.id}
//               type="button"
//               onClick={() => setActiveTab(tab.id)}
//               className={[
//                 "rounded-full px-4 py-2 text-sm font-medium transition",
//                 isActive
//                   ? "bg-accent text-accent-foreground"
//                   : "text-muted-foreground hover:text-foreground",
//               ].join(" ")}
//             >
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       <div className="mt-5 rounded-[2rem] border border-border bg-card p-3 shadow-sm">
//         {activeTab === "discover" ? (
//           <div className="flex flex-col gap-3 md:flex-row md:items-center">
//             <textarea
//               rows={3}
//               placeholder="Describe the kind of movie or show you want..."
//               className="min-h-[92px] w-full resize-none rounded-2xl border border-transparent bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
//             />
//             <button className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90">
//               Discover
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-3 md:flex-row md:items-center">
//             <input
//               type="text"
//               placeholder="Search by title, movie, show, or person..."
//               className="h-14 w-full rounded-2xl border border-transparent bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
//             />
//             <button className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90">
//               Search
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { searchAll } from "@/services/search";
import { discoverTitles } from "@/services/discover";
import type { UnifiedSearchResponse } from "@/types/search";
import type { DiscoverResponse } from "@/types/discover";
import { SearchTitleCard } from "@/components/cards/search-title-card";
import { SearchPersonCard } from "@/components/cards/search-person-card";
import { DiscoverResultCard } from "@/components/cards/discover-result-card";

const tabs = [
  { id: "title", label: "Title Search" },
  { id: "discover", label: "AI Discover" },
] as const;

export function SearchDiscoverTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("discover");
  const [searchInput, setSearchInput] = useState("");
  const [discoverInput, setDiscoverInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UnifiedSearchResponse | null>(null);
  const [discoverResults, setDiscoverResults] = useState<DiscoverResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      });
      setDiscoverResults(data);
      setSearchResults(null);
    } catch {
      setError("Discovery failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-[2rem] border border-border bg-card p-3 shadow-sm">
        {activeTab === "discover" ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <textarea
              rows={3}
              placeholder="Describe the kind of movie or show you want..."
              value={discoverInput}
              onChange={(e) => setDiscoverInput(e.target.value)}
              className="min-h-[92px] w-full resize-none rounded-2xl border border-transparent bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button 
              onClick={handleDiscover}
              disabled={loading}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Discover"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              placeholder="Search by title, movie, show, or person..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-14 w-full rounded-2xl border border-transparent bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        )}
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-800">{error}</div>}
      
      {searchResults && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Search Results</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.titles?.map((title) => (
              <SearchTitleCard key={title.id} item={title} />
            ))}
            {searchResults.people?.map((person) => (
              <SearchPersonCard key={person.id} item={person} />
            ))}
          </div>
        </div>
      )}

      {discoverResults && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Discover Results</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {discoverResults.results?.map((result) => (
              <DiscoverResultCard key={result.id} item={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}