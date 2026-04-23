export function ResultReasonChips({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-border bg-chip px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}