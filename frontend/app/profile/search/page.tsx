import Link from "next/link";
import { searchPublicProfiles } from "@/services/public-profile";

type PageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ProfileSearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const profiles = q ? await searchPublicProfiles(q) : [];

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-bold">Find Profiles</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Search users by username or display name.
          </p>

          <form className="mt-5 flex gap-3">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search profiles..."
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
            />
            <button
              type="submit"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
            >
              Search
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {!q ? (
              <p className="text-sm text-muted-foreground">
                Enter a username or display name to start.
              </p>
            ) : profiles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No profiles found.</p>
            ) : (
              profiles.map((profile) => {
                const username = profile.username_slug || profile.username;
                const displayName = profile.display_name || profile.username;

                return (
                  <Link
                    key={username}
                    href={`/profile/${username}`}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition hover:bg-muted/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-sm font-semibold">
                      {profile.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatar_url}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        displayName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        @{username}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
