import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DiscoverResult } from "@/types/discover";
import { tmdbPosterUrl } from "@/lib/images";
import { ResultMetaRow } from "@/components/results/result-meta-row";
import { ResultReasonChips } from "@/components/results/result-reason-chips";
import { ResultCastRow } from "@/components/results/result-cast-row";

export function RichDiscoverResultCard({ item }: { item: DiscoverResult }) {
  const href = item.media_type === "movie" ? `/movie/${item.slug}` : `/tv/${item.slug}`;
  const posterUrl = tmdbPosterUrl(item.poster_url);

  const year =
    item.media_type === "movie"
      ? item.release_date?.slice(0, 4)
      : item.first_air_date?.slice(0, 4);

  const reasonChips = item.similarity_reasons.slice(0, 3);

  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.18 }}>
      <div className="rounded-[2rem] border border-border bg-card p-4 transition-all duration-200 hover:border-accent/60 hover:shadow-md">
        <div className="grid gap-4 md:grid-cols-[120px_1fr_auto]">
          <Link
            href={href}
            className="group relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background"
          >
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={item.name}
                fill
                sizes="120px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </Link>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {year ? <span>{year}</span> : null}
              <span>•</span>
              <span>{item.media_type.toUpperCase()}</span>
              {item.genres.length > 0 ? (
                <>
                  <span>•</span>
                  <span>{item.genres.slice(0, 3).join(" • ")}</span>
                </>
              ) : null}
            </div>

            <Link href={href}>
              <h3 className="mt-2 text-xl font-semibold tracking-tight transition hover:text-accent">
                {item.name}
              </h3>
            </Link>

            {item.overview ? (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {item.overview}
              </p>
            ) : null}

            <p className="mt-3 text-sm leading-6 text-foreground/85">
              {item.match_explanation || "Semantically matched to your prompt."}
            </p>

            <div className="mt-4">
              <ResultMetaRow
                rating={item.vote_average}
                voteCount={item.vote_count}
                runtimeMinutes={item.runtime_minutes}
                seasonsCount={item.seasons_count}
                mediaType={item.media_type}
              />
            </div>

            {item.media_type === "tv" && item.episode_duration_display ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Episode length: {item.episode_duration_display}
              </p>
            ) : null}

            <div className="mt-3">
              <ResultCastRow cast={item.cast_preview} />
            </div>

            <div className="mt-4">
              <ResultReasonChips items={reasonChips} />
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="rounded-2xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground">
            Simcine Match {(item.similarity_score * 100).toFixed(1)}%
            </div>

            <Link
              href={href}
              className="inline-flex h-10 items-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:border-accent/60 hover:text-accent"
            >
              View title
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}