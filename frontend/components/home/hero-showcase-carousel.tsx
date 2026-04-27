"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { tmdbBackdropUrl, tmdbPosterUrl } from "@/lib/images";

type ShowcaseItem = {
  title: string;
  slug: string;
  mediaType: "movie" | "tv";
  poster: string;
  backdrop: string;
  genres: string[];
  blurb: string;
  score?: string;
};

const showcaseItems: ShowcaseItem[] = [
  {
    title: "The Office",
    slug: "the-office-2316",
    mediaType: "tv",
    poster: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    backdrop: "/mLyW3UTgi2lsMdtueYODcfAB9Ku.jpg",
    genres: ["Comedy", "Workplace"],
    blurb: "A mockumentary-style office comedy built on awkward humor, character chemistry, and everyday chaos.",
    score: "Workplace comedy",
  },
  {
    title: "Breaking Bad",
    slug: "breaking-bad-1396",
    mediaType: "tv",
    poster: "/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    backdrop: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    genres: ["Crime", "Drama"],
    blurb: "A dark, escalating character study about pride, desperation, and moral collapse under pressure.",
    score: "Dark crime drama",
  },
  {
    title: "Peaky Blinders",
    slug: "peaky-blinders-60574",
    mediaType: "tv",
    poster: "/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    backdrop: "/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg",
    genres: ["Crime", "Drama"],
    blurb: "Stylized, tense, and character-driven crime storytelling with slow-burn intensity and ambition.",
    score: "Stylized intensity",
  },
  {
    title: "Modern Family",
    slug: "modern-family-1421",
    mediaType: "tv",
    poster: "/k5Qg5rgPoKdh3yTJJrLtyoyYGwC.jpg",
    backdrop: "/nO7EzksrBzlNpAg5rgv8HzaBIkx.jpg",
    genres: ["Comedy", "Family"],
    blurb: "A warm ensemble comedy balancing family dynamics, humor, and emotional everyday moments.",
    score: "Feel-good comedy",
  },
];

function DesktopCarousel({
  index,
  isPaused,
  setIsPaused,
  goPrev,
  goNext,
  setIndex,
}: {
  index: number;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  goPrev: () => void;
  goNext: () => void;
  setIndex: (value: number) => void;
}) {
  const activeItem = showcaseItems[index];
  const href =
    activeItem.mediaType === "movie"
      ? `/movie/${activeItem.slug}`
      : `/tv/${activeItem.slug}`;

  return (
    <div className="relative hidden lg:block">
      <div
        className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.slug}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.995 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Link href={href} className="absolute inset-0 z-10 block" aria-label={activeItem.title} />

              <div className="absolute inset-0">
                {tmdbBackdropUrl(activeItem.backdrop) ? (
                  <Image
                    src={tmdbBackdropUrl(activeItem.backdrop)!}
                    alt={activeItem.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    priority
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/15 dark:from-background dark:via-background/70 dark:to-background/10" />
              </div>

              <div className="relative flex h-full flex-col justify-end p-8">
                <div className="mb-6 flex items-end gap-5">
                  <div className="relative h-[220px] w-[150px] shrink-0 overflow-hidden rounded-3xl border border-border/80 shadow-lg">
                    {tmdbPosterUrl(activeItem.poster) ? (
                      <Image
                        src={tmdbPosterUrl(activeItem.poster)!}
                        alt={activeItem.title}
                        fill
                        sizes="150px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="max-w-md">
                    <div className="inline-flex rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur">
                      Featured pick
                    </div>

                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                      {activeItem.title}
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {activeItem.mediaType.toUpperCase()} • {activeItem.genres.join(" • ")}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-foreground/85">
                      {activeItem.blurb}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                        {activeItem.score}
                      </span>

                      <span className="inline-flex items-center rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur">
                        View title
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute left-6 top-6 z-20 flex items-center gap-2">
            {showcaseItems.map((item, dotIndex) => {
              const active = dotIndex === index;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(dotIndex);
                  }}
                  className={[
                    "h-2.5 rounded-full transition-all",
                    active ? "w-8 bg-accent" : "w-2.5 bg-foreground/20 hover:bg-foreground/35",
                  ].join(" ")}
                  aria-label={`Go to ${item.title}`}
                />
              );
            })}
          </div>

          <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-sm font-medium text-foreground backdrop-blur transition hover:border-accent/60 hover:text-accent"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-sm font-medium text-foreground backdrop-blur transition hover:border-accent/60 hover:text-accent"
              aria-label="Next slide"
            >
              →
            </button>
          </div>

          {isPaused ? (
            <div className="absolute bottom-4 right-6 z-20 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
              Paused
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TabletCarousel({
  index,
  isPaused,
  setIsPaused,
  goPrev,
  goNext,
  setIndex,
}: {
  index: number;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  goPrev: () => void;
  goNext: () => void;
  setIndex: (value: number) => void;
}) {
  const activeItem = showcaseItems[index];
  const href =
    activeItem.mediaType === "movie"
      ? `/movie/${activeItem.slug}`
      : `/tv/${activeItem.slug}`;

  return (
    <div className="hidden md:block lg:hidden">
      <div
        className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.slug}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Link href={href} className="absolute inset-0 z-10 block" aria-label={activeItem.title} />

              <div className="absolute inset-0">
                {tmdbBackdropUrl(activeItem.backdrop) ? (
                  <Image
                    src={tmdbBackdropUrl(activeItem.backdrop)!}
                    alt={activeItem.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45 dark:from-background dark:via-background/85 dark:to-background/40" />
              </div>

              <div className="relative grid h-full grid-cols-[150px_1fr] gap-5 p-5">
                <div className="relative overflow-hidden rounded-3xl border border-border/80 shadow-lg">
                  {tmdbPosterUrl(activeItem.poster) ? (
                    <Image
                      src={tmdbPosterUrl(activeItem.poster)!}
                      alt={activeItem.title}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col justify-center">
                  <div className="inline-flex w-fit rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur">
                    Featured pick
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                    {activeItem.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {activeItem.mediaType.toUpperCase()} • {activeItem.genres.join(" • ")}
                  </p>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-foreground/85">
                    {activeItem.blurb}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                      {activeItem.score}
                    </span>
                    {/* <span className="text-sm font-medium text-foreground">Tap anywhere to open</span> */}
                    <span className="inline-flex items-center rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur">
                      View title
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
            <button
              type="button"
                onClick={(e) => {
                e.stopPropagation();
                setIndex(dotIndex);
                }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-sm font-medium text-foreground backdrop-blur transition hover:border-accent/60 hover:text-accent"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-sm font-medium text-foreground backdrop-blur transition hover:border-accent/60 hover:text-accent"
              aria-label="Next slide"
            >
              →
            </button>
          </div>

          <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2">
            {showcaseItems.map((item, dotIndex) => {
              const active = dotIndex === index;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // parent updates via shared state
                  }}
                  className={[
                    "h-2 rounded-full transition-all",
                    active ? "w-6 bg-accent" : "w-2 bg-foreground/20",
                  ].join(" ")}
                  aria-label={`Go to ${item.title}`}
                />
              );
            })}
          </div>

          {isPaused ? (
            <div className="absolute bottom-4 right-4 z-20 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
              Paused
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MobileCarousel() {
  return (
    <div className="md:hidden">
      <p className="mb-3 text-sm font-semibold text-foreground">Featured picks</p>
      <div className="-mx-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-4">
          {showcaseItems.map((item) => {
            const href =
              item.mediaType === "movie"
                ? `/movie/${item.slug}`
                : `/tv/${item.slug}`;

            return (
              <Link
                key={item.slug}
                href={href}
                className="group relative min-w-[88%] snap-center overflow-hidden rounded-[1.75rem] border border-border shadow-sm transition-all duration-200 hover:border-accent/60"
              >
                <div className="absolute inset-0">
                  {tmdbBackdropUrl(item.backdrop) ? (
                    <Image
                      src={tmdbBackdropUrl(item.backdrop)!}
                      alt={item.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45 dark:from-background dark:via-background/85 dark:to-background/40" />
                </div>

                <div className="relative flex gap-3 p-3">
                  <div className="relative h-[150px] w-[105px] shrink-0 overflow-hidden rounded-2xl border border-border bg-background">
                    {tmdbPosterUrl(item.poster) ? (
                      <Image
                        src={tmdbPosterUrl(item.poster)!}
                        alt={item.title}
                        fill
                        sizes="105px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 py-1">
                    <div className="inline-flex rounded-full border border-border bg-chip px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Featured
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-xl font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.mediaType.toUpperCase()} • {item.genres.join(" • ")}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.score ? (
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                          {item.score}
                        </span>
                      ) : null}
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground">
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function HeroShowcaseCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % showcaseItems.length);
    }, 7000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  function goPrev() {
    setIndex((current) => (current - 1 + showcaseItems.length) % showcaseItems.length);
  }

  function goNext() {
    setIndex((current) => (current + 1) % showcaseItems.length);
  }

  return (
    <>
      <DesktopCarousel
        index={index}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        goPrev={goPrev}
        goNext={goNext}
        setIndex={setIndex}
      />
        <TabletCarousel
        index={index}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        goPrev={goPrev}
        goNext={goNext}
        setIndex={setIndex}
        />
      <MobileCarousel />
    </>
  );
}