'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-text text-bg-alt/90">
      <div className="site-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-semibold text-bg tracking-wide mb-4">
              LOOP & LOOM
            </h3>
            <p className="text-bg-alt/70 text-sm leading-relaxed mb-6">
              Handmade crochet accessories crafted with love. Each piece tells a story of patience,
              creativity, and artisanal skill.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-bg/10 flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="mailto:loopandloom@gmail.com"
                className="w-10 h-10 rounded-xl bg-bg/10 flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-lg font-medium text-bg mb-4">Shop</h4>
            <nav className="space-y-2.5" aria-label="Shop links">
              <Link href="/shop?category=bags" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Crochet Bags
              </Link>
              <Link href="/shop?category=hair-accessories" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Hair Accessories
              </Link>
              <Link href="/shop?category=earrings-jewellery" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Earrings & Jewellery
              </Link>
              <Link href="/shop?category=scarves-clothing" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Scarves & Clothing
              </Link>
              <Link href="/shop?category=custom-gifts" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Custom Gifts
              </Link>
            </nav>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-display text-lg font-medium text-bg mb-4">Learn</h4>
            <nav className="space-y-2.5" aria-label="Course links">
              <Link href="/courses" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                All Courses
              </Link>
              <Link href="/courses?level=beginner" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Beginner Courses
              </Link>
              <Link href="/courses?level=intermediate" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Intermediate Courses
              </Link>
              <Link href="/dashboard" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                My Dashboard
              </Link>
            </nav>
          </div>

          {/* Contact & Policies */}
          <div>
            <h4 className="font-display text-lg font-medium text-bg mb-4">Contact</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm text-bg-alt/70">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:loopandloom@gmail.com" className="hover:text-bg transition-colors">
                  loopandloom@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-bg-alt/70">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <a href="tel:+917708905419" className="hover:text-bg transition-colors">
                  +91 7708905419
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-bg-alt/70">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Chennai, India</span>
              </div>
            </div>
            <h4 className="font-display text-lg font-medium text-bg mb-3">Policies</h4>
            <nav className="space-y-2.5" aria-label="Policy links">
              <Link href="/shipping" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Shipping & Returns
              </Link>
              <Link href="/privacy" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-bg-alt/70 hover:text-bg transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-bg/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-bg-alt/50">
            © 2026 Loop & Loom. All rights reserved. Handmade with ❤️ in India.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-bg-alt/50">We accept</span>
            <div className="flex items-center gap-2 text-xs text-bg-alt/70">
              <span className="px-2 py-1 bg-bg/10 rounded">UPI</span>
              <span className="px-2 py-1 bg-bg/10 rounded">Cards</span>
              <span className="px-2 py-1 bg-bg/10 rounded">Net Banking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
