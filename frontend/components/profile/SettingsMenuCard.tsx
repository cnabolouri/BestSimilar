import Link from "next/link";
import { ChevronRight } from "lucide-react";

type SettingsMenuCardProps = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  danger?: boolean;
  children?: React.ReactNode;
};

export function SettingsMenuCard({
  title,
  description,
  href,
  icon: Icon,
  danger = false,
  children,
}: SettingsMenuCardProps) {
  return (
    <Link href={href}>
      <div
        className={`group rounded-2xl border p-5 shadow-sm transition ${
          danger
            ? "border-destructive/30 bg-destructive/10 hover:bg-destructive/15"
            : "border-border bg-card text-card-foreground hover:bg-muted/40"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
              danger
                ? "border-destructive/30 bg-background text-destructive"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h2
                className={`font-semibold ${
                  danger ? "text-destructive" : "text-foreground"
                }`}
              >
                {title}
              </h2>
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition group-hover:translate-x-0.5 ${
                  danger ? "text-destructive/70" : "text-muted-foreground"
                }`}
              />
            </div>
            <p
              className={`mt-1 text-sm leading-6 ${
                danger ? "text-destructive/80" : "text-muted-foreground"
              }`}
            >
              {description}
            </p>
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
      </div>
    </Link>
  );
}
