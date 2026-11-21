'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/courses', label: 'Crochet Courses' },
  { href: '/workshops', label: 'Workshops', isNew: true },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { items, openCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Sliding bubble refs
  const navCapsuleRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Sliding bubble: measure active link position and move single bubble element
  const measureBubble = () => {
    const activeIdx = navLinks.findIndex((l) => l.href === pathname);
    const capsule = navCapsuleRef.current;
    const link = linkRefs.current[activeIdx];
    if (!capsule || !link) {
      setBubbleStyle({ opacity: 0 });
      return;
    }
    const capsuleRect = capsule.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const offsetX = linkRect.left - capsuleRect.left - 8; // 8 = capsule padding
    setBubbleStyle({
      opacity: 1,
      width: linkRect.width,
      height: linkRect.height,
      transform: `translateY(-50%) translateX(${offsetX}px)`,
    });
  };

  // Run after paint (refs are attached), re-run on route or mount changes
  useEffect(() => {
    measureBubble();
    window.addEventListener('resize', measureBubble);
    return () => window.removeEventListener('resize', measureBubble);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mounted]);

  const itemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'header-liquid-glass is-scrolled' : 'header-liquid-glass'
        }`}
      >
        {/* Top Announcement Bar */}
        <div className="bg-[#604734] text-[#FBF3E7] min-h-[27px] py-1 px-3 sm:px-4 flex items-center justify-center text-center">
          <p className="font-body flex items-center justify-center gap-1.5 text-[9.5px] sm:text-[11.5px] tracking-wide leading-tight">
            <span className="text-[#E9D9C4]">✧</span>
            <span>Free Express Shipping across India on orders ₹999+</span>
            <span className="opacity-60 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Use code <strong className="text-amber-200 font-semibold tracking-wider">HELLO-CRAFT</strong> for 10% off</span>
          </p>
        </div>

        {/* Main Header Container (responsive 68px on mobile, 80px on desktop) */}
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6 h-[68px] sm:h-[80px] flex items-center justify-between gap-2">
          
          {/* Mobile menu button (on tablet / phone) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-[#604734] hover:text-[#B96F48] transition-colors rounded-lg"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* ── Brand Logo (Left) ─────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            {/* Circular L&L Logo Icon */}
            <div className="relative w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] rounded-full overflow-hidden flex-shrink-0 border border-[#604734]/15 shadow-sm bg-white group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo.png"
                alt="Loop & Loom Official Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Brand Title & Subtitle */}
            <div className="flex flex-col">
              <span className="font-display text-[18px] sm:text-[22px] font-bold tracking-[0.06em] text-[#604734] group-hover:text-[#B96F48] transition-colors leading-tight whitespace-nowrap">
                LOOP &amp; LOOM
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.14em] uppercase text-[#8A7664] font-body whitespace-nowrap hidden sm:block mt-0.5">
                HANDMADE WITH LOVE · LEARN WITH JOY
              </span>
            </div>
          </Link>

          {/* ── Central Translucent Liquid Glass Navigation ────────── */}
          <nav
            ref={navCapsuleRef}
            className="hidden lg:flex items-center nav-liquid-capsule"
            aria-label="Main navigation"
          >
            {/* Single sliding liquid-glass bubble */}
            <span className="nav-sliding-bubble" style={bubbleStyle} aria-hidden="true">
              <span className="nav-bubble-gloss" />
              <span className="nav-bubble-caustic" />
            </span>

            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              // Only apply white text when bubble is actually showing (opacity>0)
              const bubbleVisible = isActive && (bubbleStyle.opacity as number) > 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => { linkRefs.current[idx] = el; }}
                  className={`nav-liquid-item ${isActive ? 'is-active' : ''} ${bubbleVisible ? 'bubble-visible' : ''}`}
                >
                  {link.label}
                  {'isNew' in link && link.isNew && (
                    <span style={{
                      display:'inline-block', marginLeft:4, fontSize:8, fontWeight:700,
                      padding:'1px 5px', borderRadius:999, background:'#A96845',
                      color:'#fff', letterSpacing:'0.08em', verticalAlign:'middle',
                    }}>NEW</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right-Side Actions Group ──────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="action-liquid-btn"
              aria-label="Search catalog"
            >
              <Search size={16} strokeWidth={2} />
            </button>

            {/* Admin Studio Glass Pill (Shown only for authorized admin) */}
            {mounted && isAuthenticated && user?.role === 'admin' && (
              <Link
                href="/admin"
                className="action-admin-pill"
                aria-label="Admin Studio"
              >
                <Sparkles size={13} className="text-[#B96F48]" />
                <span>Admin Studio</span>
              </Link>
            )}

            {/* User Account Cream Glass Pill */}
            {mounted && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="action-user-pill"
                aria-label="My Account"
              >
                <div className="w-5 h-5 rounded-full bg-[#B96F48]/20 text-[#8C5236] flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-inner">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="truncate max-w-[85px] sm:max-w-[100px]">
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="action-user-pill"
                aria-label="Sign In"
              >
                <User size={14} className="text-[#604734]" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="action-liquid-btn relative"
              aria-label={`Shopping Cart with ${itemCount} items`}
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B96F48] text-white text-[9.5px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Responsive Mobile Menu Drawer ─────────────────────── */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FCF6EC]/98 backdrop-blur-xl border-t border-[#E8DCCB] animate-slide-down">
            <nav className="max-w-[1200px] mx-auto px-6 py-4 space-y-1.5" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                    pathname === link.href
                      ? 'bg-[#B96F48]/15 text-[#B96F48]'
                      : 'text-[#604734] hover:bg-[#604734]/5'
                  }`}
                >
                  {link.label}
                  {'isNew' in link && link.isNew && (
                    <span className="ml-1.5 inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#A96845', color: '#fff' }}>NEW</span>
                  )}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#E8DCCB] mt-2 space-y-1.5">
                {mounted && !isAuthenticated && (
                  <Link
                    href="/login"
                    className="block py-2.5 px-4 rounded-xl text-xs font-semibold text-[#B96F48]"
                  >
                    Sign In / Register
                  </Link>
                )}
                {mounted && isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className="block py-2.5 px-4 rounded-xl text-xs font-semibold text-[#604734]"
                  >
                    My Dashboard
                  </Link>
                )}
                {mounted && isAuthenticated && user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#B96F48] text-white"
                  >
                    ✦ Mom&apos;s Admin Studio
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer matching responsive header height */}
      <div className="h-[95px] sm:h-[107px]" />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
