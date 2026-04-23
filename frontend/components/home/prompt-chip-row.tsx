"use client";

import { motion } from "framer-motion";

const prompts = [
  "A workplace comedy like The Office",
  "A dark crime drama with slow pacing",
  "Emotional sci-fi with philosophical themes",
  "Character-driven thrillers with tension",
];

export function PromptChipRow({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {prompts.map((prompt) => (
        <motion.button
          key={prompt}
          type="button"
          onClick={() => onSelectPrompt(prompt)}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="rounded-full border border-border bg-chip px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
}