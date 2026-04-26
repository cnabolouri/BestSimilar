import Image from "next/image";
import Link from "next/link";
import type { PersonCredit } from "@/types/person";
import { tmdbPosterUrl } from "@/lib/images";

function getKnownFor(credits: PersonCredit[]) {
  const unique = new Map<number, PersonCredit>();

  for (const credit of credits) {
    if (!unique.has(credit.title_id)) unique.set(credit.title_id, credit);
  }

  return Array.from(unique.values())
    .sort((a, b) => {
      const aScore = a.title_vote_average * Math.log10(Math.max(a.title_vote_count, 1) + 1);
      const bScore = b.title_vote_average * Math.log10(Math.max(b.title_vote_count, 1) + 1);
      return bScore - aScore;
    })
    .slice(0, 5);
}

export function PersonKnownForSection({ credits }: { credits: PersonCredit[] }) {
  const knownFor = getKnownFor(credits);

  if (knownFor.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Known for</h2>
        <span className="text-xs text-muted-foreground">{knownFor.length} titles</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {knownFor.map((credit) => {
          const href =
            credit.title_media_type === "movie"
              ? `/movie/${credit.title_slug}`
              : `/tv/${credit.title_slug}`;

          const posterUrl = tmdbPosterUrl(credit.title_poster_url);

          return (
            <Link
              key={credit.title_id}
              href={href}
              className="group rounded-3xl border border-border bg-card p-3 transition hover:border-accent/60 hover:shadow-sm"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-background">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={credit.title_name}
                    fill
                    sizes="180px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <h3 className="mt-3 line-clamp-2 text-sm font-semibold group-hover:text-accent">
                {credit.title_name}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                ⭐ {credit.title_vote_average.toFixed(1)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}