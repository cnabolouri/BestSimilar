"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DiscoverResult } from "@/types/discover";
import { tmdbPosterUrl } from "@/lib/images";
import { TitleQuickActions } from "@/components/actions/title-quick-actions";

export function DiscoverResultCard({ item }: { item: DiscoverResult }) {
  const href = item.media_type === "movie" ? `/movie/${item.slug}` : `/tv/${item.slug}`;
  const posterUrl = tmdbPosterUrl(item.poster_url);

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.18 }}>
      <Link
        href={href}
        className="simcine-card group block rounded-3xl border border-border bg-card p-[var(--simcine-card-padding)] transition-all duration-200 hover:border-accent/60 hover:shadow-md"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
          <TitleQuickActions titleSlug={item.slug} />
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-end p-3 text-xs font-semibold text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-[length:var(--simcine-card-title-size)] font-semibold leading-5">{item.name}</h3>
          <p className="mt-1 text-[length:var(--simcine-card-meta-size)] text-muted-foreground">{item.genres.slice(0, 3).join(" • ")}</p>
          <p className="mt-3 text-[length:var(--simcine-card-meta-size)] font-medium text-accent">
            Simcine Match {(item.similarity_score * 100).toFixed(1)}%
          </p>          {item.similarity_reasons[0] ? (
            <p className="mt-2 text-[length:var(--simcine-card-meta-size)] leading-5 text-muted-foreground">{item.similarity_reasons[0]}</p>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}
