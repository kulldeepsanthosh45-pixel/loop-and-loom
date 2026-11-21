import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiquidNotification from "@/components/LiquidNotification";

export const metadata: Metadata = {
  title: "Loop & Loom — Handmade Crochet Accessories & Courses",
  description:
    "Discover handmade crochet bags, earrings, hairbands, and more. Learn the art of crochet with our online courses. Handmade with love, crafted to last.",
  keywords: [
    "crochet",
    "handmade",
    "crochet bags",
    "crochet earrings",
    "crochet courses",
    "learn crochet",
    "handmade accessories",
    "Loop and Loom",
  ],
  openGraph: {
    title: "Loop & Loom — Handmade Crochet Accessories & Courses",
    description:
      "Discover handmade crochet bags, earrings, hairbands, and more. Learn the art of crochet with our online courses.",
    type: "website",
    locale: "en_IN",
    siteName: "Loop & Loom",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased overflow-x-hidden bg-bg text-text">
        <LiquidNotification />
        <Suspense fallback={<div className="h-20 bg-card border-b border-border" />}>
          <Header />
        </Suspense>
        <main className="min-h-screen">
          <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center text-xs text-muted">Loading...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
