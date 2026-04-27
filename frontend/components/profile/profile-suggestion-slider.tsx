"use client";

import Image from "next/image";
import Link from "next/link";
import type { SimilarTitle } from "@/types/title";
import { tmdbPosterUrl } from "@/lib/images";

export function ProfileSuggestionSlider({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: SimilarTitle[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="-mx-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-4">
          {items.map((item) => {
            const href =
              item.media_type === "movie"
                ? `/movie/${item.slug}`
                : `/tv/${item.slug}`;

            const posterUrl = tmdbPosterUrl(item.poster_url);

            return (
              <Link
                key={item.id}
                href={href}
                className="group min-w-[190px] snap-start rounded-3xl border border-border bg-card p-3 transition hover:border-accent/60 hover:shadow-sm"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={item.name}
                      fill
                      sizes="190px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <h3 className="mt-3 line-clamp-2 text-sm font-semibold group-hover:text-accent">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.media_type.toUpperCase()}
                </p>

                {typeof item.similarity_score === "number" ? (
                  <p className="mt-2 text-xs font-medium text-accent">
                    Simcine Match {(item.similarity_score * 100).toFixed(1)}%
                  </p>
                ) : null}

                {item.similarity_reasons?.[0] ? (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {item.similarity_reasons[0]}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}