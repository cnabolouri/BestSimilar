import Link from "next/link";
import { tmdbProfileUrl } from "@/lib/images";
import { PersonQuickActions } from "@/components/actions/person-quick-actions";

type FlatPersonItem = {
  person?: {
    slug?: string;
    name?: string;
    profile_url?: string;
    known_for_department?: string;
  };
  person_slug?: string;
  person_name?: string;
  profile_url?: string;
  known_for_department?: string;
};

type PublicPersonPreviewCardProps = {
  item: FlatPersonItem;
};

export function PublicPersonPreviewCard({ item }: PublicPersonPreviewCardProps) {
  const nestedPerson = item.person;
  const slug = nestedPerson?.slug || item.person_slug;
  const name = nestedPerson?.name || item.person_name || "Unknown";
  const image = tmdbProfileUrl(nestedPerson?.profile_url || item.profile_url);
  const department =
    nestedPerson?.known_for_department || item.known_for_department || null;

  return (
    <div className="group relative w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <Link href={slug ? `/people/${slug}` : "#"} className="block">
        <div className="relative aspect-[2/3] bg-muted">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              {name.slice(0, 2).toUpperCase()}
            </div>
          )}
          {slug && <PersonQuickActions personSlug={slug} />}
        </div>

        <div className="p-2">
          <p className="line-clamp-2 text-sm font-medium leading-snug">{name}</p>
          {department && (
            <p className="mt-1 text-xs capitalize text-muted-foreground">
              {department}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
