import Link from "next/link";
import { Pencil } from "lucide-react";

type ProfileUser = {
  displayName: string;
  username: string;
  bio: string;
  memberSince: string;
  avatarUrl: string | null;
};

type ProfileHeaderProps = {
  user: ProfileUser;
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const initials = user.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted text-2xl font-semibold text-foreground shadow-sm">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {user.displayName}
              </h1>

              <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                @{user.username}
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {user.bio}
            </p>

            <p className="mt-3 text-xs text-muted-foreground">
              Member since {user.memberSince}
            </p>
          </div>
        </div>

        <Link
          href="/profile/settings/personal-info"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/70"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>
    </section>
  );
}
