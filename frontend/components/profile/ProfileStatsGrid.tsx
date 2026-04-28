import Link from "next/link";
import { Bookmark, Eye, Heart, MessageSquare, Star } from "lucide-react";

type ProfileStats = {
  watchlist: number | null;
  favorites: number | null;
  watched: number | null;
  ratings: number | null;
  reviews: number | null;
};

type ProfileVisibility = {
  watchlist?: boolean;
  favorites?: boolean;
  history?: boolean;
  ratings?: boolean;
  reviews?: boolean;
};

type ProfileStatsGridProps = {
  stats: ProfileStats;
  basePath?: string;
  mode?: "private" | "public";
  visibility?: ProfileVisibility;
};

export function ProfileStatsGrid({
  stats,
  basePath = "/profile",
  mode = "private",
  visibility,
}: ProfileStatsGridProps) {
  const items = [
    {
      key: "watchlist",
      label: "Watchlist",
      value: stats.watchlist,
      href: `${basePath}/watchlist`,
      icon: Bookmark,
      description: "Saved for later",
      visible: visibility?.watchlist ?? true,
    },
    {
      key: "favorites",
      label: "Favorites",
      value: stats.favorites,
      href: `${basePath}/favorites`,
      icon: Heart,
      description: "Titles and people",
      visible: visibility?.favorites ?? true,
    },
    {
      key: "history",
      label: "Watched",
      value: stats.watched,
      href: `${basePath}/history`,
      icon: Eye,
      description: "Watch history",
      visible: visibility?.history ?? true,
    },
    {
      key: "ratings",
      label: "Ratings",
      value: stats.ratings,
      href: `${basePath}/ratings`,
      icon: Star,
      description: "Rated titles",
      visible: visibility?.ratings ?? true,
    },
    {
      key: "reviews",
      label: "Reviews",
      value: stats.reviews,
      href: `${basePath}/reviews`,
      icon: MessageSquare,
      description: mode === "public" ? "Written reviews" : "Coming soon",
      visible: visibility?.reviews ?? mode === "private",
      disabled: mode === "private",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;

        if (mode === "public" && !item.visible) {
          return (
            <div
              key={item.key}
              className="rounded-2xl border border-border bg-muted/30 p-4 text-muted-foreground"
            >
              <div className="w-fit rounded-xl border border-border bg-background p-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-xs">Private</p>
              </div>
            </div>
          );
        }

        const card = (
          <div className="group rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm transition hover:bg-muted/40">
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-xl border border-border bg-muted p-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>

              {item.disabled && (
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  Soon
                </span>
              )}
            </div>

            <div className="mt-4">
              <p className="text-2xl font-bold">{item.value ?? 0}</p>
              <p className="mt-1 text-sm font-medium">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        );

        if (item.disabled) {
          return <div key={item.key}>{card}</div>;
        }

        return (
          <Link key={item.key} href={item.href}>
            {card}
          </Link>
        );
      })}
    </section>
  );
}
