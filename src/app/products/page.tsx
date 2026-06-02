import { Suspense } from "react";
import { ProductsPageClient } from "./products-client";

export const metadata = { title: "Shop All" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageClient />
    </Suspense>
  );
}

function ProductsLoading() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
