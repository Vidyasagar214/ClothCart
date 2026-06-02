export type CategorySlug = "men" | "women" | "children";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  price: number;
  compareAt: number | null;
  rating: number;
  reviews: number;
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  tags: string[];
  image: string;
  images: string[];
  description: string;
  featured: boolean;
  material?: string;
  fit?: string;
  care?: string[];
  highlights?: string[];
  sku?: string;
  variants?: ProductVariant[];
}

export interface Category {
  id: CategorySlug;
  name: string;
  slug: CategorySlug;
  image: string;
  count: number;
}

export interface Review {
  productId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface SavedAddress extends ShippingAddress {
  id: string;
  label: string;
  isDefault: boolean;
}

export interface CartItem {
  id?: string;
  variantId?: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  productName?: string;
  productImage?: string;
  productSlug?: string;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet" | "cod";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderTimelineStep {
  status: string;
  date: string | null;
  label: string;
}

export interface Order {
  id: string;
  dbId?: string;
  orderNumber?: string;
  items: CartItem[];
  totals: CartTotals;
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  timeline: OrderTimelineStep[];
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role?: "customer" | "admin" | "support";
  joined: string;
}

export type SortOption = "new" | "price_asc" | "price_desc" | "popularity";
