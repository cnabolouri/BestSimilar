import { HeroShowcaseCarousel } from "@/components/home/hero-showcase-carousel";
import { SearchDiscoverTabs } from "@/components/home/search-discover-tabs";

export function HeroSection() {
  return (
    <section className="grid min-h-[70vh] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="inline-flex rounded-full border border-border bg-chip px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground">
          AI-native movie & show discovery
        </div>

        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          Find what <span className="text-accent">feels similar.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Search by title or describe a tone, theme, mood, or story style. Simcine uses semantic
          similarity to surface movies and shows that match meaning, not just tags.
        </p>

        <div className="mt-8 max-w-3xl">
          <SearchDiscoverTabs />
        </div>
      </div>

      <div className="order-first md:order-first lg:order-last">
        <HeroShowcaseCarousel />
      </div>
    </section>
  );
}