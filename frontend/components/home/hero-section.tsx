import { PromptChipRow } from "@/components/home/prompt-chip-row";
import { SearchDiscoverTabs } from "@/components/home/search-discover-tabs";

export function HeroSection() {
  return (
    <section className="grid min-h-[70vh] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <div className="inline-flex rounded-full border border-border bg-chip px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground">
          AI-native movie & show discovery
        </div>

        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          Find what <span className="text-accent">feels similar.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Search by title or describe a tone, theme, mood, or story style. Simcine uses semantic similarity to surface movies and shows that match meaning, not just tags.
        </p>

        <div className="mt-8 max-w-3xl">
          <SearchDiscoverTabs />
          <PromptChipRow />
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/10 to-transparent blur-3xl" />
        <div className="relative grid grid-cols-4 gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-sm">
          {[
            "The Office",
            "Breaking Bad",
            "Peaky Blinders",
            "Modern Family",
            "Dexter",
            "Interstellar",
            "True Detective",
            "Succession",
          ].map((title, index) => (
            <div
              key={title}
              className={`flex aspect-[2/3] items-end rounded-2xl border border-border bg-background p-3 text-xs font-semibold leading-snug text-foreground shadow-sm ${
                index === 0 ? "translate-y-4" : index % 2 === 0 ? "-translate-y-2" : "translate-y-1"
              }`}
            >
              {title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}