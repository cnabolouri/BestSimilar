import Link from "next/link";
import { motion } from "framer-motion";
import type { SearchPerson } from "@/types/search";

export function SearchPersonCard({ item }: { item: SearchPerson }) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.18 }}>
      <Link
        href={`/person/${item.slug}`}
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all duration-200 hover:border-accent/60 hover:shadow-md"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] text-muted-foreground">
          Person
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{item.known_for_department || "Person"}</p>
        </div>
      </Link>
    </motion.div>
  );
}