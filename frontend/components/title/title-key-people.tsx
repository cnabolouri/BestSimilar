import Link from "next/link";
import type { TitleCredit } from "@/types/title";

function pickFirst(credits: TitleCredit[], roleType: string, jobIncludes?: string) {
  return credits.find((credit) => {
    if (credit.role_type !== roleType) return false;
    if (!jobIncludes) return true;
    return (credit.job_name || "").toLowerCase().includes(jobIncludes.toLowerCase());
  });
}

export function TitleKeyPeople({ credits }: { credits: TitleCredit[] }) {
  const director = pickFirst(credits, "crew", "director");
  const writer =
    pickFirst(credits, "crew", "writer") ||
    pickFirst(credits, "crew", "screenplay") ||
    pickFirst(credits, "crew", "story");

  const actors = credits.filter((credit) => credit.role_type === "actor").slice(0, 3);

  const items = [
    director
      ? {
          label: "Director",
          name: director.person_name,
          slug: director.person_slug,
          sublabel: director.job_name || "Director",
        }
      : null,
    writer
      ? {
          label: "Writer",
          name: writer.person_name,
          slug: writer.person_slug,
          sublabel: writer.job_name || "Writer",
        }
      : null,
    ...actors.map((actor, index) => ({
      label: index === 0 ? "Lead cast" : "Cast",
      name: actor.person_name,
      slug: actor.person_slug,
      sublabel: actor.character_name || "Actor",
    })),
  ].filter(Boolean) as Array<{
    label: string;
    name: string;
    slug: string;
    sublabel: string;
  }>;

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold">Key people</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={`${item.label}-${item.slug}`}
            href={`/person/${item.slug}`}
            className="rounded-2xl border border-border bg-card px-4 py-3 transition hover:border-accent/60 hover:shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">{item.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.sublabel}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}