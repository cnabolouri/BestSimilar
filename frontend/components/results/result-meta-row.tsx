type ResultMetaRowProps = {
  rating?: number | null;
  voteCount?: number | null;
  runtimeMinutes?: number | null;
  seasonsCount?: number | null;
  mediaType?: "movie" | "tv";
};

export function ResultMetaRow({
  rating,
  voteCount,
  runtimeMinutes,
  seasonsCount,
  mediaType,
}: ResultMetaRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {typeof rating === "number" ? <span>⭐ {rating.toFixed(1)}</span> : null}
      {typeof voteCount === "number" ? <span>{voteCount.toLocaleString()} votes</span> : null}
      {typeof runtimeMinutes === "number" && runtimeMinutes > 0 ? (
        <span>{runtimeMinutes} min</span>
      ) : null}
      {mediaType === "tv" && typeof seasonsCount === "number" && seasonsCount > 0 ? (
        <span>{seasonsCount} seasons</span>
      ) : null}
    </div>
  );
}