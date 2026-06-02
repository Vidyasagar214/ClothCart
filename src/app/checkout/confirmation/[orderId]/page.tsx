"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <div className="pt-24 pb-20 max-w-2xl mx-auto px-4 sm:px-6 text-center">
      <div className="glass-strong rounded-3xl p-10 sm:p-14 border border-emerald-500/30 bg-emerald-500/5">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-emerald-400 mb-3">Order Confirmed!</h1>
        <p className="text-slate-300 mb-2">Thank you for shopping with ClothCart.</p>
        <p className="text-lg font-semibold mb-6">Order #{orderId}</p>
        <p className="text-sm text-slate-400 mb-8">Estimated delivery in 3–5 business days. You&apos;ll receive a confirmation email shortly.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/orders?confirmed=${orderId}`}><Button>Track Order</Button></Link>
          <Link href="/products"><Button variant="outline">Continue Shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
