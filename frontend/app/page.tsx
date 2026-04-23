import { HeroSection } from "@/components/home/hero-section";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-16 pt-10 md:px-8 lg:px-10">
      <HeroSection />

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Search by title",
            body: "Start with a movie or show you already love and let Simcine find what feels similar.",
          },
          {
            title: "Discover by prompt",
            body: "Describe a tone, theme, mood, or story style and get semantically relevant results.",
          },
          {
            title: "Build your taste profile",
            body: "Save favorites, refine recommendations, and turn discovery into a personal experience.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur"
          >
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}