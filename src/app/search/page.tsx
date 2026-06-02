import { Suspense } from "react";
import { SearchPageClient } from "./search-client";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-slate-400">Searching...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
