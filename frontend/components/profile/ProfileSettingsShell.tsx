import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ProfileSettingsShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
};

export function ProfileSettingsShell({
  title,
  description,
  children,
  danger = false,
}: ProfileSettingsShellProps) {
  return (
    <main className="bg-background px-4 py-6 text-foreground">
      <section
        className={`mx-auto max-w-4xl rounded-2xl border p-5 shadow-sm ${
          danger
            ? "border-destructive/30 bg-destructive/10"
            : "border-border bg-card text-card-foreground"
        }`}
      >
        <div className="mb-5">
          <Link
            href="/profile/settings"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to settings
          </Link>

          <h1
            className={`text-2xl font-bold tracking-tight ${
              danger ? "text-destructive" : "text-foreground"
            }`}
          >
            {title}
          </h1>

          <p
            className={`mt-2 text-sm ${
              danger ? "text-destructive/80" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>
        </div>

        {children}
      </section>
    </main>
  );
}
