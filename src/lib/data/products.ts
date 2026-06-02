import type { Product, Category, Review } from "@/types";
import { IMAGES } from "@/lib/data/images";
import { EXTRA_PRODUCTS } from "@/lib/data/products-extra";

const CORE_PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "nebula-performance-jacket",
    name: "Nebula Performance Jacket",
    brand: "Apex Wear",
    category: "men",
    subcategory: "Jackets",
    price: 4999,
    compareAt: 6999,
    rating: 4.8,
    reviews: 234,
    colors: [
      { name: "Midnight", hex: "#1e1b4b" },
      { name: "Storm", hex: "#374151" },
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    tags: ["waterproof", "performance", "new"],
    image: IMAGES.jacket,
    images: [IMAGES.jacket, IMAGES.jacketAlt],
    description:
      "Engineered for peak performance. The Nebula Jacket features breathable waterproof fabric, laser-cut ventilation, and a sleek futuristic silhouette that commands attention.",
    featured: true,
  },
  {
    id: "p2",
    slug: "quantum-silk-blouse",
    name: "Quantum Silk Blouse",
    brand: "Lumière",
    category: "women",
    subcategory: "Tops",
    price: 3299,
    compareAt: 4499,
    rating: 4.9,
    reviews: 189,
    colors: [
      { name: "Pearl", hex: "#f5f5f4" },
      { name: "Rose", hex: "#fda4af" },
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 32,
    tags: ["silk", "elegant", "bestseller"],
    image: IMAGES.blouse,
    images: [IMAGES.blouse, IMAGES.fashion],
    description:
      "Luxurious mulberry silk with an iridescent finish. The Quantum Blouse drapes effortlessly, elevating any ensemble from day to evening.",
    featured: true,
  },
  {
    id: "p3",
    slug: "starlight-kids-hoodie",
    name: "Starlight Kids Hoodie",
    brand: "MiniNova",
    category: "children",
    subcategory: "Hoodies",
    price: 1899,
    compareAt: 2499,
    rating: 4.7,
    reviews: 156,
    colors: [
      { name: "Cosmic Blue", hex: "#3b82f6" },
      { name: "Galaxy Purple", hex: "#a855f7" },
    ],
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    stock: 67,
    tags: ["kids", "cozy", "glow"],
    image: IMAGES.kidsHoodie,
    images: [IMAGES.kidsHoodie],
    description:
      "Ultra-soft organic cotton hoodie with reflective star print. Built for adventure, designed for comfort.",
    featured: true,
  },
  {
    id: "p4",
    slug: "velocity-slim-fit-jeans",
    name: "Velocity Slim Fit Jeans",
    brand: "Apex Wear",
    category: "men",
    subcategory: "Pants",
    price: 2799,
    compareAt: 3499,
    rating: 4.6,
    reviews: 412,
    colors: [
      { name: "Indigo", hex: "#312e81" },
      { name: "Black", hex: "#0f0f0f" },
    ],
    sizes: ["28", "30", "32", "34", "36"],
    stock: 89,
    tags: ["denim", "slim-fit"],
    image: IMAGES.jeans,
    images: [IMAGES.jeans],
    description:
      "Premium stretch denim with a modern slim silhouette. Reinforced seams and fade-resistant wash technology.",
    featured: false,
  },
  {
    id: "p5",
    slug: "eclipse-maxi-dress",
    name: "Eclipse Maxi Dress",
    brand: "Lumière",
    category: "women",
    subcategory: "Dresses",
    price: 5499,
    compareAt: 7499,
    rating: 4.9,
    reviews: 98,
    colors: [
      { name: "Onyx", hex: "#18181b" },
      { name: "Champagne", hex: "#d4a574" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 21,
    tags: ["evening", "maxi", "new"],
    image: IMAGES.maxiDress,
    images: [IMAGES.maxiDress],
    description:
      "A statement maxi dress with architectural draping and subtle metallic threading. Red carpet ready.",
    featured: true,
  },
  {
    id: "p6",
    slug: "pulse-active-leggings",
    name: "Pulse Active Leggings",
    brand: "Kinetic",
    category: "women",
    subcategory: "Activewear",
    price: 2199,
    compareAt: 2999,
    rating: 4.8,
    reviews: 567,
    colors: [
      { name: "Electric", hex: "#06b6d4" },
      { name: "Void", hex: "#09090b" },
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 112,
    tags: ["activewear", "bestseller"],
    image: IMAGES.leggings,
    images: [IMAGES.leggings],
    description:
      "Four-way stretch with moisture-wicking technology. High-rise waistband with hidden pocket.",
    featured: false,
  },
  {
    id: "p7",
    slug: "orbit-kids-sneakers",
    name: "Orbit Kids Sneakers",
    brand: "MiniNova",
    category: "children",
    subcategory: "Footwear",
    price: 2499,
    compareAt: 3199,
    rating: 4.5,
    reviews: 203,
    colors: [
      { name: "Neon Green", hex: "#22c55e" },
      { name: "Solar Orange", hex: "#f97316" },
    ],
    sizes: ["28", "30", "32", "34"],
    stock: 54,
    tags: ["footwear", "kids"],
    image: IMAGES.kidsSneakers,
    images: [IMAGES.kidsSneakers],
    description:
      "Lightweight cushioned sneakers with LED accent strips. Machine washable and built to last.",
    featured: false,
  },
  {
    id: "p8",
    slug: "horizon-linen-shirt",
    name: "Horizon Linen Shirt",
    brand: "Apex Wear",
    category: "men",
    subcategory: "Shirts",
    price: 2499,
    compareAt: null,
    rating: 4.4,
    reviews: 178,
    colors: [
      { name: "Sand", hex: "#d6d3d1" },
      { name: "Ocean", hex: "#0ea5e9" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 38,
    tags: ["linen", "summer"],
    image: IMAGES.linenShirt,
    images: [IMAGES.linenShirt],
    description:
      "Breathable European linen with a relaxed fit. Perfect for warm days and elevated casual looks.",
    featured: false,
  },
  {
    id: "p9",
    slug: "prism-knit-sweater",
    name: "Prism Knit Sweater",
    brand: "Lumière",
    category: "women",
    subcategory: "Knitwear",
    price: 3799,
    compareAt: 4999,
    rating: 4.7,
    reviews: 145,
    colors: [
      { name: "Lavender", hex: "#c084fc" },
      { name: "Cream", hex: "#fef3c7" },
    ],
    sizes: ["S", "M", "L"],
    stock: 28,
    tags: ["knitwear", "cozy"],
    image: IMAGES.knitSweater,
    images: [IMAGES.knitSweater],
    description:
      "Hand-finished merino wool blend with gradient ombré knitting. A cozy luxury essential.",
    featured: true,
  },
  {
    id: "p10",
    slug: "rocket-kids-joggers",
    name: "Rocket Kids Joggers",
    brand: "MiniNova",
    category: "children",
    subcategory: "Pants",
    price: 1299,
    compareAt: 1699,
    rating: 4.6,
    reviews: 89,
    colors: [
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Red", hex: "#dc2626" },
    ],
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    stock: 76,
    tags: ["kids", "casual"],
    image: IMAGES.kidsCasual,
    images: [IMAGES.kidsCasual],
    description:
      "Stretchy joggers with reinforced knees and fun rocket patch detail. Playground approved.",
    featured: false,
  },
  {
    id: "p11",
    slug: "titan-wool-overcoat",
    name: "Titan Wool Overcoat",
    brand: "Apex Wear",
    category: "men",
    subcategory: "Coats",
    price: 8999,
    compareAt: 12999,
    rating: 4.9,
    reviews: 67,
    colors: [{ name: "Charcoal", hex: "#374151" }],
    sizes: ["M", "L", "XL"],
    stock: 12,
    tags: ["wool", "premium", "winter"],
    image: IMAGES.overcoat,
    images: [IMAGES.overcoat],
    description:
      "Italian wool overcoat with structured shoulders and satin lining. Timeless power dressing.",
    featured: true,
  },
  {
    id: "p12",
    slug: "aurora-yoga-set",
    name: "Aurora Yoga Set",
    brand: "Kinetic",
    category: "women",
    subcategory: "Activewear",
    price: 3999,
    compareAt: 5499,
    rating: 4.8,
    reviews: 312,
    colors: [
      { name: "Sunset", hex: "#f472b6" },
      { name: "Teal", hex: "#14b8a6" },
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 43,
    tags: ["yoga", "set", "new"],
    image: IMAGES.yogaSet,
    images: [IMAGES.yogaSet],
    description:
      "Matching sports bra and high-waist leggings in buttery-soft recycled fabric. Move with confidence.",
    featured: false,
  },
];

export const PRODUCTS: Product[] = [...CORE_PRODUCTS, ...EXTRA_PRODUCTS];

export const CATEGORIES: Category[] = [
  {
    id: "men",
    name: "Men",
    slug: "men",
    image: IMAGES.categoryMen,
    count: PRODUCTS.filter((p) => p.category === "men").length,
  },
  {
    id: "women",
    name: "Women",
    slug: "women",
    image: IMAGES.categoryWomen,
    count: PRODUCTS.filter((p) => p.category === "women").length,
  },
  {
    id: "children",
    name: "Children",
    slug: "children",
    image: IMAGES.categoryChildren,
    count: PRODUCTS.filter((p) => p.category === "children").length,
  },
];

export const REVIEWS: Review[] = [
  {
    productId: "p1",
    author: "Arjun M.",
    rating: 5,
    text: "Absolutely stunning jacket. The quality exceeds expectations and the fit is perfect.",
    date: "2026-05-15",
  },
  {
    productId: "p1",
    author: "Rahul K.",
    rating: 4,
    text: "Great performance wear. Runs slightly large — size down.",
    date: "2026-05-02",
  },
  {
    productId: "p2",
    author: "Priya S.",
    rating: 5,
    text: "The silk quality is incredible. I receive compliments every time I wear it.",
    date: "2026-05-20",
  },
  {
    productId: "p5",
    author: "Ananya R.",
    rating: 5,
    text: "Stunning dress — fits like it was tailored for me. Worth every rupee.",
    date: "2026-05-18",
  },
  {
    productId: "p5",
    author: "Meera K.",
    rating: 4,
    text: "Beautiful fabric and drape. Runs slightly long for petite frames.",
    date: "2026-05-10",
  },
  {
    productId: "p21",
    author: "Vikram S.",
    rating: 5,
    text: "Best hoodie I've owned. Heavyweight but not bulky. Perfect oversized fit.",
    date: "2026-05-22",
  },
  {
    productId: "p16",
    author: "Divya P.",
    rating: 5,
    text: "Instant confidence boost. The tailoring is impeccable.",
    date: "2026-05-14",
  },
];

export function getProduct(idOrSlug: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  const arrivals = PRODUCTS.filter((p) => p.tags.includes("new"));
  return (arrivals.length ? arrivals : PRODUCTS.slice(0, limit)).slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, limit);
}

export function getBrands(): string[] {
  return [...new Set(PRODUCTS.map((p) => p.brand))].sort();
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(
    0,
    limit
  );
}

export function getReviewsForProduct(productId: string): Review[] {
  return REVIEWS.filter((r) => r.productId === productId);
}
