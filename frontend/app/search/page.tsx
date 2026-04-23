import { Suspense } from "react";
import { SearchPageClient } from "@/components/search/search-page-client";

function SearchContent() {
  return <SearchPageClient />;
}

export default function SearchPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8 lg:px-10">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}