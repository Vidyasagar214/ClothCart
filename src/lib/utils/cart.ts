import type { CartItem, CartTotals } from "@/types";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT } from "@/lib/constants";

export function calcCartTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = 0;
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * TAX_RATE);
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? SHIPPING_FLAT : 0;
  const total = taxable + tax + shipping;
  return { subtotal, discount, tax, shipping, total };
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}
