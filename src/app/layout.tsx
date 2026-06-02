import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer, MobileNav } from "@/components/layout/footer";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ClothCart — Shop the Future of Fashion",
    template: "%s | ClothCart",
  },
  description: "Premium online clothing store for Men, Women, and Children.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body className="mesh-bg pb-20 lg:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-violet-600 text-white px-4 py-2 rounded-lg z-[100]">
          Skip to main content
        </a>
        <AppProviders>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  );
}
