const prompts = [
  "A workplace comedy like The Office",
  "A dark crime drama with slow pacing",
  "Emotional sci-fi with philosophical themes",
  "Character-driven thrillers with tension",
];

export function PromptChipRow() {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="rounded-full border border-border bg-chip px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-foreground"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}