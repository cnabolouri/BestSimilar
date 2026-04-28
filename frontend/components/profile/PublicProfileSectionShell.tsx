import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

type PublicProfileSectionShellProps = {
  username: string;
  title: string;
  description?: string;
  isPrivate?: boolean;
  children?: React.ReactNode;
};

export function PublicProfileSectionShell({
  username,
  title,
  description,
  isPrivate = false,
  children,
}: PublicProfileSectionShellProps) {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href={`/profile/${username}`}
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to @{username}
        </Link>

        <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}

          {isPrivate ? (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              This section is private.
            </div>
          ) : (
            <div className="mt-5">{children}</div>
          )}
        </section>
      </div>
    </main>
  );
}
