import Link from "next/link";
import {
  Bookmark,
  ChevronRight,
  Eye,
  Heart,
  MessageSquare,
  Star,
} from "lucide-react";

export function ProfileLibrarySection() {
  const links = [
    {
      label: "Watchlist",
      href: "/profile/watchlist",
      description: "Movies and shows you want to watch later.",
      icon: Bookmark,
    },
    {
      label: "Favorites",
      href: "/profile/favorites",
      description: "Your favorite titles and people.",
      icon: Heart,
    },
    {
      label: "Watch History",
      href: "/profile/history",
      description: "Titles you have already watched.",
      icon: Eye,
    },
    {
      label: "Ratings",
      href: "/profile/ratings",
      description: "Titles you rated from 1 to 10.",
      icon: Star,
    },
    {
      label: "Reviews",
      href: "/profile/reviews",
      description: "Written reviews and thoughts. Coming soon.",
      icon: MessageSquare,
      disabled: true,
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Your Library</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jump back into your saved titles, favorites, ratings, and history.
        </p>
      </div>

      <div className="grid gap-3">
        {links.map((item) => {
          const Icon = item.icon;

          const content = (
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition hover:bg-muted/40">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.label}</h3>

                  {item.disabled && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      Soon
                    </span>
                  )}
                </div>

                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              {!item.disabled && (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          );

          if (item.disabled) {
            return <div key={item.label}>{content}</div>;
          }

          return (
            <Link key={item.label} href={item.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
