export function TitleNewsSection() {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Recent news</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            News, updates, release activity, and related coverage for this title will appear here
            once the news integration is added.
          </p>
        </div>

        <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Coming soon
        </span>
      </div>
    </section>
  );
}