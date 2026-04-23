"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DiscoverResult } from "@/types/discover";
import { tmdbPosterUrl } from "@/lib/images";

export function DiscoverResultCard({ item }: { item: DiscoverResult }) {
  const href = item.media_type === "movie" ? `/movie/${item.slug}` : `/tv/${item.slug}`;
  const posterUrl = tmdbPosterUrl(item.poster_url);

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.18 }}>
      <Link
        href={href}
        className="group block rounded-3xl border border-border bg-card p-4 transition-all duration-200 hover:border-accent/60 hover:shadow-md"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
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
          <h3 className="text-sm font-semibold leading-5">{item.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{item.genres.slice(0, 3).join(" • ")}</p>
          <p className="mt-3 text-xs font-medium text-accent">
            Simcine Match {(item.similarity_score * 100).toFixed(1)}%
          </p>          {item.similarity_reasons[0] ? (
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.similarity_reasons[0]}</p>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}