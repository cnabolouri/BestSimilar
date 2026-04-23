export function ResultCastRow({ cast }: { cast?: string[] }) {
  if (!cast || cast.length === 0) return null;

  return (
    <p className="text-xs text-muted-foreground">
      <span className="font-medium text-foreground">Cast:</span> {cast.join(" • ")}
    </p>
  );
}