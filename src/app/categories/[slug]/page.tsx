import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, listProducts } from "@/lib/products/catalog";
import { ProductGrid } from "@/components/product/product-grid";
import type { CategorySlug } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug as CategorySlug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug as CategorySlug);

  if (!category) notFound();

  const { products, total } = await listProducts({ category: category.slug, limit: 24 });

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <nav className="text-sm text-slate-400 mb-4">
        <Link href="/" className="hover:text-white">Home</Link>
        {" / "}
        <span className="text-white">{category.name}</span>
      </nav>
      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{category.name}</h1>
      <p className="text-slate-400 mb-10">{total} styles available</p>
      <ProductGrid products={products} showQuickAdd />
    </div>
  );
}
