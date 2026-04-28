import { notFound } from "next/navigation";
import { ProfileStatsGrid } from "@/components/profile/ProfileStatsGrid";
import { PublicProfilePreviewSection } from "@/components/profile/PublicProfilePreviewSection";
import {
  getPublicProfileOverview,
  type PublicProfileOverview,
} from "@/services/public-profile";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

type PreviewItem = Record<string, unknown>;

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;

  let overview: PublicProfileOverview;

  try {
    overview = await getPublicProfileOverview(username);
  } catch {
    notFound();
  }

  const { profile, stats, visibility, previews, insights } = overview;
  const displayName = profile.display_name || profile.username;
  const initials =
    displayName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const statGridValues = {
    watchlist: stats.watchlist_count,
    favorites: stats.favorites_count,
    watched: stats.watched_count,
    ratings: stats.ratings_count,
    reviews: stats.reviews_count,
  };

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted text-2xl font-semibold">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {displayName}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                @{profile.username_slug || profile.username}
              </p>

              {profile.bio ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {profile.bio}
                </p>
              ) : null}

              {profile.member_since ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Member since{" "}
                  {new Date(profile.member_since).getFullYear().toString()}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <ProfileStatsGrid
          stats={statGridValues}
          basePath={`/profile/${username}`}
          mode="public"
          visibility={{
            watchlist: visibility.watchlist,
            favorites: visibility.favorite_titles || visibility.favorite_people,
            history: visibility.history,
            ratings: visibility.ratings,
            reviews: visibility.reviews,
          }}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-6">
            <PublicProfilePreviewSection
              title="Ratings"
              href={`/profile/${username}/ratings`}
              count={stats.ratings_count}
              isPublic={visibility.ratings}
              emptyText="No public ratings yet."
            >
              <PreviewRow items={previews.ratings} kind="rating" />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Watchlist"
              href={`/profile/${username}/watchlist`}
              count={stats.watchlist_count}
              isPublic={visibility.watchlist}
              emptyText="No public watchlist items yet."
            >
              <PreviewRow items={previews.watchlist} kind="title" />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Favorite Titles"
              href={`/profile/${username}/favorites`}
              count={stats.favorite_titles_count}
              isPublic={visibility.favorite_titles}
              emptyText="No public favorite titles yet."
            >
              <PreviewRow items={previews.favorite_titles} kind="title" />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Favorite People"
              href={`/profile/${username}/favorites`}
              count={stats.favorite_people_count}
              isPublic={visibility.favorite_people}
              emptyText="No public favorite people yet."
            >
              <PreviewRow items={previews.favorite_people} kind="person" />
            </PublicProfilePreviewSection>

            <PublicProfilePreviewSection
              title="Reviews"
              href={`/profile/${username}/reviews`}
              count={stats.reviews_count}
              isPublic={visibility.reviews}
              emptyText="No public reviews yet."
            >
              <PreviewRow items={previews.reviews} kind="review" />
            </PublicProfilePreviewSection>
          </div>

          <aside className="flex flex-col gap-6">
            <PublicProfileInsights insights={insights} />

            <PublicProfilePreviewSection
              title="Recently Watched"
              href={`/profile/${username}/history`}
              count={stats.watched_count}
              isPublic={visibility.history}
              emptyText="No public watch history yet."
            >
              <PreviewRow items={previews.history} kind="title" compact />
            </PublicProfilePreviewSection>
          </aside>
        </div>
      </div>
    </main>
  );
}

function PreviewRow({
  items,
  kind,
  compact = false,
}: {
  items: unknown[];
  kind: "title" | "person" | "rating" | "review";
  compact?: boolean;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        No preview items yet.
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "grid gap-3"
          : "flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
      }
    >
      {items.slice(0, 8).map((item, index) => (
        <PreviewCard
          key={`${kind}-${index}`}
          item={item as PreviewItem}
          kind={kind}
          compact={compact}
        />
      ))}
    </div>
  );
}

function PreviewCard({
  item,
  kind,
  compact,
}: {
  item: PreviewItem;
  kind: "title" | "person" | "rating" | "review";
  compact: boolean;
}) {
  const isPerson = kind === "person";
  const imageUrl = stringValue(isPerson ? item.profile_url : item.poster_url);
  const title = stringValue(isPerson ? item.person_name : item.title_name);
  const subtitle = isPerson
    ? stringValue(item.known_for_department) || "Person"
    : stringValue(item.media_type) || "Title";

  if (compact) {
    return (
      <div className="flex gap-3 rounded-xl border border-border bg-background p-3">
        <PreviewImage imageUrl={imageUrl} title={title} compact />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title || "Untitled"}</p>
          <p className="mt-1 text-xs capitalize text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-36 shrink-0 rounded-xl border border-border bg-background p-3">
      <PreviewImage imageUrl={imageUrl} title={title} />
      <p className="mt-3 line-clamp-2 text-sm font-medium">
        {title || "Untitled"}
      </p>
      <p className="mt-1 text-xs capitalize text-muted-foreground">
        {subtitle}
        {typeof item.rating === "number" ? ` - ${item.rating}/10` : ""}
      </p>
      {kind === "review" && stringValue(item.review) ? (
        <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
          {stringValue(item.review)}
        </p>
      ) : null}
    </div>
  );
}

function PreviewImage({
  imageUrl,
  title,
  compact = false,
}: {
  imageUrl: string;
  title: string;
  compact?: boolean;
}) {
  const className = compact
    ? "h-16 w-11 shrink-0 rounded-lg"
    : "aspect-[2/3] w-full rounded-lg";

  return (
    <div
      className={`${className} overflow-hidden border border-border bg-muted text-muted-foreground`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs">
          {title?.slice(0, 2).toUpperCase() || "?"}
        </div>
      )}
    </div>
  );
}

function PublicProfileInsights({
  insights,
}: {
  insights: PublicProfileOverview["insights"];
}) {
  const genres = insights.top_genres as PreviewItem[];
  const years = insights.top_years as PreviewItem[];
  const ratings = insights.rating_breakdown as PreviewItem[];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="text-lg font-semibold">Insights</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Interests and activity patterns based on public activity.
      </p>

      <InsightList
        title="Top Genres"
        items={genres.map((item) => ({
          label: stringValue(item["genres__name"]),
          count: numberValue(item.count),
        }))}
        emptyText="No public genre insights yet."
      />

      <InsightList
        title="Top Years"
        items={years.map((item) => ({
          label: stringValue(item.year),
          count: numberValue(item.count),
        }))}
        emptyText="No public year insights yet."
      />

      <InsightList
        title="Rating Breakdown"
        items={ratings.map((item) => ({
          label: `${stringValue(item.rating)}/10`,
          count: numberValue(item.count),
        }))}
        emptyText="No public rating insights yet."
      />
    </section>
  );
}

function InsightList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: { label: string; count: number }[];
  emptyText: string;
}) {
  const visibleItems = items.filter((item) => item.label);

  return (
    <div className="mt-5">
      <h3 className="text-sm font-medium">{title}</h3>
      {visibleItems.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleItems.slice(0, 8).map((item) => (
            <span
              key={`${title}-${item.label}`}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
            >
              {item.label} - {item.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function stringValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function numberValue(value: unknown) {
  return typeof value === "number" ? value : 0;
}
