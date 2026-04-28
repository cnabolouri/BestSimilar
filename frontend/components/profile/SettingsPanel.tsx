type SettingsPanelProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
};

export function SettingsPanel({
  title,
  description,
  children,
  danger = false,
}: SettingsPanelProps) {
  return (
    <section
      className={`rounded-2xl border p-5 ${
        danger
          ? "border-destructive/30 bg-background/70"
          : "border-border bg-background/60"
      }`}
    >
      <div className="mb-5">
        <h2
          className={`text-base font-semibold ${
            danger ? "text-destructive" : "text-foreground"
          }`}
        >
          {title}
        </h2>

        {description && (
          <p
            className={`mt-1 text-sm ${
              danger ? "text-destructive/80" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
