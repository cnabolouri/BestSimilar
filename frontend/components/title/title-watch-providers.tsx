export function TitleWatchProviders() {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Where to watch</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Streaming and purchase provider support will appear here once watch-provider
            data is connected to the backend.
          </p>
        </div>

        <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Coming soon
        </span>
      </div>
    </section>
  );
}