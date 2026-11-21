'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles, BookOpen, Heart, Send, ShoppingBag, CheckCircle2, Leaf, ShieldCheck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CourseCard from '@/components/CourseCard';
import WorkshopPopup from '@/components/WorkshopPopup';
import { products, categories, courses, reviews } from '@/lib/data';
import { useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const featuredCourses = courses.filter((c) => c.isFeatured).slice(0, 3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FBF3E7] overflow-x-clip">
      <WorkshopPopup />
      {/* Centered Main Column (Unified 1100px width on desktop) */}
      <div className="relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 xl:px-0">

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* ─── DEDICATED LEFT DECORATIVE RAIL (FRAMING THE WHOLE PAGE) ─────────── */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <aside className="hidden xl:block absolute right-full top-0 w-[calc((100vw-1100px)/2)] h-full pointer-events-none select-none z-10" aria-hidden="true">
          {/* ── TOP ZONE: FLOATING CRAFT STICKERS (HERO & NEW ARRIVALS) ── */}
          <div className="relative w-full h-[760px] overflow-visible">
            {/* 1. Daisy flower sticker */}
            <div className="absolute top-[28px] right-[45px] w-[88px] h-[82px] craft-sticker animate-sticker-1 pointer-events-auto rotate-[12deg]">
              <Image src="/images/hero/sticker-daisy.png" alt="Crochet daisy sticker" width={88} height={82} className="object-contain" priority />
            </div>

            {/* Heart doodle next to daisy */}
            <div className="absolute top-[52px] right-[25px] font-script text-[#B96F48] text-[20px] select-none rotate-[-6deg]">
              ♡
            </div>

            {/* Handwritten 'Handmade' script with underline flourish */}
            <div className="absolute top-[102px] right-[20px] w-[130px] craft-sticker animate-sticker-3 pointer-events-auto rotate-[-5deg]">
              <div className="font-script text-[#604734] text-[27px] leading-none tracking-wide select-none">
                Handmade
              </div>
              <svg viewBox="0 0 100 20" className="w-[105px] h-3 text-[#B96F48] fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
                <path d="M5 8 Q50 18 95 6" />
                <circle cx="97" cy="6" r="2" fill="currentColor" />
              </svg>
            </div>

            {/* 2. Star item: Olive mini tote bag sticker */}
            <div className="absolute top-[158px] right-[30px] w-[205px] h-[275px] craft-sticker animate-sticker-2 pointer-events-auto rotate-[-8deg]">
              <Image src="/images/hero/sticker-bag.png" alt="Olive green crochet daisy tote bag" width={205} height={275} className="object-contain" priority />
            </div>

            {/* Small scribble doodle beneath bag */}
            <div className="absolute top-[430px] right-[60px] text-[#8A7968]/70 rotate-[10deg]">
              <svg viewBox="0 0 40 20" className="w-8 h-4 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
                <path d="M5 10 Q20 5 35 12" />
              </svg>
            </div>

            {/* 3. Floral dangle earrings sticker */}
            <div className="absolute top-[450px] right-[45px] w-[165px] h-[135px] craft-sticker animate-sticker-1 pointer-events-auto rotate-[6deg]">
              <Image src="/images/hero/sticker-earrings.png" alt="Crochet flower dangle earrings with wooden studs" width={165} height={135} className="object-contain" priority />
            </div>

            {/* 4. Dusty rose scrunchie sticker */}
            <div className="absolute top-[595px] right-[75px] w-[145px] h-[140px] craft-sticker animate-sticker-3 pointer-events-auto rotate-[-6deg]">
              <Image src="/images/hero/sticker-scrunchie.png" alt="Dusty rose crochet scrunchie" width={145} height={140} className="object-contain" priority />
            </div>

            {/* Heart doodle next to scrunchie */}
            <div className="absolute top-[640px] right-[35px] font-script text-[#B96F48] text-[22px] select-none rotate-[8deg]">
              ♡
            </div>

            {/* 5. Trailing botanical sketch doodle */}
            <div className="absolute top-[735px] right-[95px] text-[#8A7968]/60 rotate-[4deg]">
              <svg viewBox="0 0 30 65" className="w-6 h-14 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
                <path d="M15 5 Q15 32 15 60" />
                <path d="M15 15 L24 8" />
                <path d="M15 22 L6 15" />
                <path d="M15 32 L24 25" />
                <path d="M15 40 L6 33" />
                <path d="M15 50 L24 43" />
              </svg>
            </div>
          </div>

          {/* ── MIDDLE ZONE (CATEGORIES & COURSES) ── */}
          {/* 6. Twisted terracotta headband */}
          <div className="absolute top-[1120px] left-1/2 -translate-x-1/2 w-[150px] h-[105px] craft-sticker animate-sticker-2 pointer-events-auto rotate-[-8deg]">
            <Image src="/images/hero/side-headband.png" alt="Headband" width={150} height={105} className="object-contain" />
          </div>

          {/* 7. Hand-drawn wooden crochet hook sketch */}
          <div className="absolute top-[1260px] left-1/2 -translate-x-1/4 rotate-[15deg]">
            <svg viewBox="0 0 100 24" className="w-24 h-6 text-[#8A7968]/70 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12 h75 c8 0 14 -4 10 -9 c-3 -4 -10 1 -7 5" />
            </svg>
          </div>

          {/* Heart doodle and sparkle */}
          <div className="absolute top-[1320px] left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="font-script text-base text-[#B96F48]">♡</span>
            <span className="text-xs text-[#B96F48]">✦</span>
          </div>

          {/* Handwritten "Slow living, one stitch at a time" */}
          <div className="absolute top-[1370px] left-1/2 -translate-x-1/2 w-48 text-center font-script text-[#B96F48] text-[22px] leading-tight rotate-[-4deg] craft-sticker pointer-events-auto">
            <span>Slow living,</span><br />
            <span className="text-[19px]">one stitch at a time</span>
            <span className="text-sm ml-1">♡</span>
          </div>

          {/* 8. Handcrafted daisy brooch / coaster */}
          <div className="absolute top-[1490px] left-1/2 -translate-x-1/2 w-[85px] h-[85px] craft-sticker animate-sticker-1 pointer-events-auto rotate-6">
            <Image src="/images/hero/left-daisy.png" alt="Daisy brooch" width={85} height={85} className="object-contain" />
          </div>

          {/* Botanical eucalyptus branch doodle */}
          <div className="absolute top-[1620px] left-1/2 -translate-x-1/2 text-[#8A7968]/60">
            <svg viewBox="0 0 40 70" className="w-7 h-14 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 5 Q20 35 20 65" />
              <circle cx="12" cy="20" r="5" />
              <circle cx="28" cy="28" r="5" />
              <circle cx="12" cy="42" r="5" />
              <circle cx="28" cy="50" r="5" />
            </svg>
          </div>

          {/* ── LOWER ZONE (BRAND STORY & REVIEWS) ── */}
          {/* 9. Cream unbleached cotton yarn skein */}
          <div className="absolute top-[1880px] left-1/2 -translate-x-1/2 w-[130px] h-[130px] craft-sticker animate-sticker-3 pointer-events-auto rotate-[6deg]">
            <Image src="/images/hero/side-yarn.png" alt="Organic yarn" width={130} height={130} className="object-contain" />
          </div>

          {/* Sparkle cluster */}
          <div className="absolute top-[2040px] left-1/2 text-xs text-[#B96F48] flex gap-1">
            <span>✦</span>
            <span className="text-[10px]">✧</span>
          </div>

          {/* Handwritten "Step by step, stitch by stitch" */}
          <div className="absolute top-[2090px] left-1/2 -translate-x-1/2 w-48 text-center font-script text-[#604734]/80 text-[21px] leading-tight rotate-[3deg] craft-sticker pointer-events-auto">
            <span>Step by step,</span><br />
            <span className="text-[18px]">stitch by stitch</span>
            <span className="text-sm ml-1 text-[#B96F48]">✦</span>
          </div>

          {/* 10. Micro-crochet floral dangle earrings */}
          <div className="absolute top-[2210px] left-1/2 -translate-x-1/2 w-[85px] h-[85px] craft-sticker animate-sticker-2 pointer-events-auto rotate-[-8deg]">
            <Image src="/images/hero/left-earrings.png" alt="Earrings" width={85} height={85} className="object-contain" />
          </div>

          {/* Wooden craft buttons & needle doodle */}
          <div className="absolute top-[2480px] left-1/2 -translate-x-1/2 text-[#8A7968]/70">
            <svg viewBox="0 0 50 50" className="w-10 h-10 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="20" cy="25" r="12" />
              <circle cx="17" cy="22" r="1.5" fill="currentColor" />
              <circle cx="23" cy="22" r="1.5" fill="currentColor" />
              <circle cx="17" cy="28" r="1.5" fill="currentColor" />
              <circle cx="23" cy="28" r="1.5" fill="currentColor" />
              <line x1="12" y1="5" x2="38" y2="45" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Handwritten "Handmade with love ♡" */}
          <div className="absolute top-[2580px] left-1/2 -translate-x-1/2 w-48 text-center font-script text-[#B96F48] text-[23px] rotate-[-3deg] craft-sticker pointer-events-auto">
            <span>Handmade with love ♡</span>
          </div>

          {/* 11. Dusty rose scrunchie */}
          <div className="absolute top-[2700px] left-1/2 -translate-x-1/2 w-[95px] h-[90px] craft-sticker animate-sticker-1 pointer-events-auto rotate-6">
            <Image src="/images/hero/left-scrunchie.png" alt="Scrunchie" width={95} height={90} className="object-contain" />
          </div>

          {/* Trailing botanical dried wheat sketch near newsletter */}
          <div className="absolute top-[3150px] left-1/2 -translate-x-1/2 text-[#8A7968]/60 rotate-[5deg]">
            <svg viewBox="0 0 40 90" className="w-8 h-20 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 10 Q20 45 20 85" />
              <path d="M20 20 L10 12" />
              <path d="M20 25 L30 17" />
              <path d="M20 35 L10 27" />
              <path d="M20 40 L30 32" />
              <path d="M20 50 L10 42" />
              <path d="M20 55 L30 47" />
            </svg>
          </div>

          {/* Final heart cluster */}
          <div className="absolute top-[3350px] left-1/2 -translate-x-1/2 font-script text-[#B96F48] text-lg">
            <span>♡</span>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* ─── DEDICATED RIGHT DECORATIVE RAIL (FRAMING THE WHOLE PAGE) ────────── */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <aside className="hidden xl:block absolute left-full top-0 w-[calc((100vw-1100px)/2)] h-full pointer-events-none select-none z-10" aria-hidden="true">
          {/* ── TOP ZONE: FLOATING CRAFT STICKERS (HERO & NEW ARRIVALS) ── */}
          <div className="relative w-full h-[760px] overflow-visible">
            {/* 1. Dusty pink bow hair clip sticker */}
            <div className="absolute top-[28px] left-[35px] w-[120px] h-[90px] craft-sticker animate-sticker-2 pointer-events-auto rotate-[-8deg]">
              <Image src="/images/hero/sticker-bow.png" alt="Dusty pink crochet bow clip" width={120} height={90} className="object-contain" priority />
            </div>

            {/* Sparkle sunburst rays doodle around bow */}
            <div className="absolute top-[22px] left-[155px] text-xs text-[#B96F48] flex gap-1 select-none animate-pulse">
              <span>✦</span>
              <span className="text-[10px]">✧</span>
            </div>

            {/* 2. Golden sunflower with stem & leaf sticker */}
            <div className="absolute top-[130px] left-[45px] w-[120px] h-[170px] craft-sticker animate-sticker-1 pointer-events-auto rotate-[6deg]">
              <Image src="/images/hero/sticker-sunflower.png" alt="Golden crochet sunflower" width={120} height={170} className="object-contain" priority />
            </div>

            {/* 3. Handwritten quote: 'Small stitches, Big dreams ♡' */}
            <div className="absolute top-[305px] left-[20px] w-[165px] craft-sticker animate-sticker-3 pointer-events-auto rotate-[-4deg]">
              <div className="font-script text-[#B96F48] text-[23px] leading-tight select-none">
                Small stitches,<br />
                <span className="text-[20px]">Big dreams ♡</span>
              </div>
            </div>

            {/* 4. Small cream bunny keychain charm sticker */}
            <div className="absolute top-[380px] left-[40px] w-[110px] h-[155px] craft-sticker animate-sticker-2 pointer-events-auto rotate-[-5deg]">
              <Image src="/images/hero/sticker-bunny.png" alt="Crochet bunny amigurumi keychain" width={110} height={155} className="object-contain" priority />
            </div>

            {/* 5. Duo of spring crochet tulips sticker */}
            <div className="absolute top-[535px] left-[30px] w-[135px] h-[168px] craft-sticker animate-sticker-1 pointer-events-auto rotate-[8deg]">
              <Image src="/images/hero/sticker-tulips.png" alt="Spring crochet tulips" width={135} height={168} className="object-contain" priority />
            </div>

            {/* Botanical trailing branch sketch */}
            <div className="absolute top-[715px] left-[65px] text-[#8A7968]/60 rotate-[-5deg]">
              <svg viewBox="0 0 30 65" className="w-6 h-14 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
                <path d="M15 5 Q15 32 15 60" />
                <path d="M15 15 L6 8" />
                <path d="M15 22 L24 15" />
                <path d="M15 32 L6 25" />
                <path d="M15 40 L24 33" />
                <path d="M15 50 L6 43" />
              </svg>
            </div>
          </div>

          {/* ── MIDDLE ZONE (CATEGORIES & COURSES) ── */}
          {/* 6. Terracotta cotton yarn skein with paper band */}
          <div className="absolute top-[1120px] left-1/2 -translate-x-1/2 w-[140px] h-[140px] craft-sticker animate-sticker-1 pointer-events-auto rotate-[6deg]">
            <Image src="/images/hero/side-yarn.png" alt="Yarn skein" width={140} height={140} className="object-contain" />
          </div>

          {/* Tape measure spiral sketch doodle */}
          <div className="absolute top-[1290px] left-1/2 -translate-x-1/2 text-[#B96F48]/60">
            <svg viewBox="0 0 50 50" className="w-9 h-9 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 25 A15 15 0 0 1 25 10 A15 15 0 0 1 40 25 A10 10 0 0 1 25 35 A7 7 0 0 1 18 25" />
            </svg>
          </div>

          {/* Sparkle cluster */}
          <div className="absolute top-[1340px] left-1/2 text-xs text-[#B96F48] flex gap-1">
            <span>✦</span>
            <span>✧</span>
          </div>

          {/* Handwritten "100% Organic cotton yarn ✦" */}
          <div className="absolute top-[1390px] left-1/2 -translate-x-1/2 w-48 text-center font-script text-[#B96F48] text-[22px] leading-tight rotate-[4deg] craft-sticker pointer-events-auto">
            <span>100% Organic</span><br />
            <span className="text-[19px]">cotton yarn ✦</span>
          </div>

          {/* 7. Dusty pink bow hair clip */}
          <div className="absolute top-[1510px] left-1/2 -translate-x-1/2 w-[85px] h-[80px] craft-sticker animate-sticker-2 pointer-events-auto rotate-[-6deg]">
            <Image src="/images/hero/right-bow.png" alt="Bow clip" width={85} height={80} className="object-contain" />
          </div>

          {/* Botanical leaf sprig */}
          <div className="absolute top-[1630px] left-1/2 -translate-x-1/2 text-[#8A7968]/60">
            <svg viewBox="0 0 30 60" className="w-6 h-12 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
              <path d="M15 5 Q15 30 15 55" />
              <circle cx="9" cy="18" r="4" />
              <circle cx="21" cy="26" r="4" />
              <circle cx="9" cy="38" r="4" />
            </svg>
          </div>

          {/* ── LOWER ZONE (BRAND STORY & REVIEWS) ── */}
          {/* 8. Yellow sunflower with green stem */}
          <div className="absolute top-[1880px] left-1/2 -translate-x-1/2 w-[105px] h-[135px] craft-sticker animate-sticker-3 pointer-events-auto rotate-[-5deg]">
            <Image src="/images/hero/right-sunflower.png" alt="Sunflower" width={105} height={135} className="object-contain" />
          </div>

          {/* Handwritten "Master every loop ✿" */}
          <div className="absolute top-[2050px] left-1/2 -translate-x-1/2 w-48 text-center font-script text-[#604734]/80 text-[21px] rotate-[-4deg] craft-sticker pointer-events-auto">
            <span>Master every loop ✿</span>
          </div>

          {/* 9. Small cream bunny keychain */}
          <div className="absolute top-[2160px] left-1/2 -translate-x-1/2 w-[90px] h-[115px] craft-sticker animate-sticker-1 pointer-events-auto rotate-[5deg]">
            <Image src="/images/hero/right-bunny.png" alt="Bunny keychain" width={90} height={115} className="object-contain" />
          </div>

          {/* Vintage craft scissors sketch doodle */}
          <div className="absolute top-[2480px] left-1/2 -translate-x-1/2 text-[#8A7968]/70">
            <svg viewBox="0 0 40 60" className="w-8 h-12 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="48" r="7" />
              <circle cx="28" cy="48" r="7" />
              <line x1="16" y1="42" x2="30" y2="10" />
              <line x1="24" y1="42" x2="10" y2="10" />
            </svg>
          </div>

          {/* Handwritten "Small batch · Artisanal ♡" */}
          <div className="absolute top-[2580px] left-1/2 -translate-x-1/2 w-48 text-center font-script text-[#B96F48] text-[23px] rotate-[3deg] craft-sticker pointer-events-auto">
            <span>Small batch · Artisanal ♡</span>
          </div>

          {/* 10. Spring crochet tulips */}
          <div className="absolute top-[2700px] left-1/2 -translate-x-1/2 w-[110px] h-[140px] craft-sticker animate-sticker-2 pointer-events-auto rotate-[-6deg]">
            <Image src="/images/hero/right-tulips.png" alt="Tulips" width={110} height={140} className="object-contain" />
          </div>

          {/* Trailing botanical sketch doodle near newsletter */}
          <div className="absolute top-[3150px] left-1/2 -translate-x-1/2 text-[#8A7968]/60 rotate-[-6deg]">
            <svg viewBox="0 0 40 90" className="w-8 h-20 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 10 Q20 45 20 85" />
              <path d="M20 20 L30 12" />
              <path d="M20 25 L10 17" />
              <path d="M20 35 L30 27" />
              <path d="M20 40 L10 32" />
              <path d="M20 50 L30 42" />
            </svg>
          </div>

          {/* Final sparkle cluster */}
          <div className="absolute top-[3350px] left-1/2 text-xs text-[#B96F48] flex gap-1">
            <span>✧</span>
            <span>✦</span>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* ─── CENTRAL CONTENT COLUMN (ALL SECTIONS ALIGNED TO 1100px) ─────────── */}
        {/* ════════════════════════════════════════════════════════════════════════ */}

        {/* ═══════ HERO BANNER ═══════ */}
        <section className="relative pt-8 pb-0" aria-label="Hero banner">
          {/* Main Hero Card (1100px x 510px, 50/50 split) */}
          <div className="w-full bg-[#FFFDF9] rounded-[16px] border border-[#E8DCCB] shadow-[0_12px_40px_rgba(96,71,52,0.06)] overflow-hidden relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch md:h-[510px]">
              {/* Left Hero Panel */}
              <div className="p-8 lg:px-[52px] lg:py-10 flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9D9C4]/30 border border-[#E8DCCB] text-[#B96F48] text-[10.5px] font-semibold tracking-wider uppercase mb-3.5 w-fit">
                    <Sparkles className="w-3 h-3 text-[#B96F48]" />
                    <span>HANDMADE LUXURY · SLOW LIVING</span>
                  </div>

                  {/* Headline: Exact 3-line composition, ~48px font */}
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[48px] leading-[1.08] text-[#604734] font-normal mb-3.5">
                    Handmade With<br />
                    Love,<br />
                    <span className="italic text-[#B96F48] font-serif">Crafted to Last.</span>
                  </h1>

                  <p className="text-[13px] text-[#8A7968] leading-relaxed max-w-[430px] font-body mb-5">
                    Boutique crochet accessories hand-stitched with unbleached organic cotton, alongside guided online masterclasses to help you rediscover the slow joy of making.
                  </p>
                </div>

                <div>
                  {/* Buttons: Side by side on desktop, 48px height, no wrapping */}
                  <div className="flex flex-row items-center gap-3 mb-5 flex-nowrap">
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center gap-2 bg-[#B96F48] hover:bg-[#9E5B37] text-white text-xs font-semibold px-6 h-[48px] rounded-xl shadow-[0_4px_16px_rgba(185,111,72,0.25)] transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>SHOP COLLECTION →</span>
                    </Link>
                    <Link
                      href="/courses"
                      className="inline-flex items-center justify-center gap-2 border border-[#E8DCCB] bg-[#FFFDF9] hover:bg-[#FBF3E7] text-[#604734] text-xs font-semibold px-5 h-[48px] rounded-xl transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#B96F48]" />
                      <span>EXPLORE COURSES</span>
                    </Link>
                  </div>

                  {/* Benefits: All 3 on ONE horizontal row beneath thin divider */}
                  <div className="pt-3.5 border-t border-[#E8DCCB]">
                    <div className="flex flex-row items-center justify-between text-[11px] text-[#8A7968] font-body w-full">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Leaf className="w-3.5 h-3.5 text-[#B96F48] flex-shrink-0" />
                        <span>100% Organic Yarns</span>
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Heart className="w-3.5 h-3.5 text-[#B96F48] flex-shrink-0" />
                        <span>Handmade by Artisans</span>
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B96F48] flex-shrink-0" />
                        <span>Lifetime Course Access</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Hero Panel: Full-height uncropped photograph with floating review badge */}
              <div className="relative w-full h-[320px] sm:h-[420px] md:h-[510px] bg-[#FBF3E7] overflow-hidden border-t md:border-t-0 md:border-l border-[#E8DCCB]">
                <Image
                  src="/images/hero/hero-straw-bag-hat-hd.jpg"
                  alt="Natural tan crochet handbag with daisy-flower embellishments, white vase with daisies, and crochet sun hat"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 550px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#604734]/10 via-transparent to-transparent pointer-events-none" />

                {/* Floating Review Card */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-[275px] bg-[#FFFDF9]/95 backdrop-blur-md border border-[#E8DCCB] p-2.5 px-3 rounded-2xl shadow-sm flex items-center gap-2.5 z-10">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 text-xs font-bold">
                    ★
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#604734]">
                      4.9 / 5 Rating <span className="text-[#8A7968] font-normal">(500+ happy makers)</span>
                    </div>
                    <div className="text-[10px] text-[#8A7968] italic">
                      &quot;The softest organic cotton bag I own!&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── MOBILE / TABLET PLAYFUL CRAFT STRIP ─── */}
          <div className="xl:hidden mt-6 pt-5 border-t border-[#E8DCCB]">
            <p className="text-center text-[11px] text-[#8A7968] mb-3 uppercase tracking-wider font-semibold">
              Explore Handcrafted Micro-Collections
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto py-2 px-2">
              <Link href="/shop?category=bags" className="flex flex-col items-center gap-1 group flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#E8DCCB] p-1 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Image src="/images/hero/left-mini-bag.png" alt="Mini Bag" width={38} height={38} className="object-contain" />
                </div>
                <span className="text-[10px] font-medium text-[#604734]">Bags</span>
              </Link>
              <Link href="/product/botanical-bloom-micro-crochet-dangle-earrings" className="flex flex-col items-center gap-1 group flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#E8DCCB] p-1 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Image src="/images/hero/left-earrings.png" alt="Earrings" width={34} height={34} className="object-contain" />
                </div>
                <span className="text-[10px] font-medium text-[#604734]">Earrings</span>
              </Link>
              <Link href="/shop?category=hair-accessories" className="flex flex-col items-center gap-1 group flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#E8DCCB] p-1 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Image src="/images/hero/left-scrunchie.png" alt="Scrunchie" width={34} height={34} className="object-contain" />
                </div>
                <span className="text-[10px] font-medium text-[#604734]">Scrunchies</span>
              </Link>
              <Link href="/shop?category=hair-accessories" className="flex flex-col items-center gap-1 group flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#E8DCCB] p-1 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Image src="/images/hero/right-bow.png" alt="Bow" width={34} height={34} className="object-contain" />
                </div>
                <span className="text-[10px] font-medium text-[#604734]">Bows</span>
              </Link>
              <Link href="/shop?category=custom-gifts" className="flex flex-col items-center gap-1 group flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#E8DCCB] p-1 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Image src="/images/hero/right-bunny.png" alt="Bunny" width={34} height={34} className="object-contain" />
                </div>
                <span className="text-[10px] font-medium text-[#604734]">Amigurumi</span>
              </Link>
              <Link href="/shop?category=custom-gifts" className="flex flex-col items-center gap-1 group flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#E8DCCB] p-1 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Image src="/images/hero/right-tulips.png" alt="Tulips" width={34} height={34} className="object-contain" />
                </div>
                <span className="text-[10px] font-medium text-[#604734]">Flowers</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════ NEW HANDMADE ARRIVALS ═══════ */}
        <section className="pt-[80px] pb-16" aria-label="New Handmade Arrivals">
          {/* Eyebrow & Heading Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-4 gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#B96F48] font-semibold mb-1">
                FRESH OFF THE WOODEN HOOK
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#604734] font-normal">
                New Handmade Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#B96F48] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Thin beige divider underneath heading row */}
          <div className="border-b border-[#E8DCCB] mb-8" />

          {/* 4 Product Cards in a Single Row on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ═══════ SHOP BY CATEGORY ═══════ */}
        <section className="py-14 md:py-16" aria-label="Shop by Category">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B96F48] font-medium mb-2">
              Browse
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#604734] mb-2">
              Shop by Category
            </h2>
            <p className="text-[#8A7968] text-sm max-w-md mx-auto">
              Find the perfect handmade piece from our curated collections.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E8DCCB] hover:shadow-[0_8px_30px_rgba(96,71,52,0.06)] transition-all"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#604734]/70 via-[#604734]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="font-display text-lg md:text-xl font-medium text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/80">{cat.productCount} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════ CROCHET COURSES ═══════ */}
        <section className="py-14 md:py-16" aria-label="Crochet Courses">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen size={16} className="text-[#B96F48]" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#B96F48] font-medium">
                Online Academy
              </p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#604734] mb-2">
              Learn the Art of Crochet,{' '}
              <span className="italic text-[#B96F48]">One Stitch at a Time.</span>
            </h2>
            <p className="text-[#8A7968] text-sm max-w-lg mx-auto">
              From beginner basics to advanced techniques — learn at your own pace with beautifully crafted video lessons.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#B96F48] text-white rounded-xl font-medium text-sm hover:bg-[#9E5B37] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(185,111,72,0.3)]"
            >
              <span>Explore All Courses</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ═══════ BRAND STORY ═══════ */}
        <section className="py-14 md:py-16" aria-label="Our Story">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center bg-[#FFFDF9] rounded-3xl border border-[#E8DCCB] p-8 md:p-12 shadow-[0_8px_30px_rgba(96,71,52,0.04)]">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[0_12px_40px_rgba(89,67,51,0.08)]">
              <Image
                src="/images/maker-portrait.jpg"
                alt="Priya, the maker behind Loop & Loom, crocheting at her workspace"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#B96F48] font-medium mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#604734] mb-5 leading-snug">
                Every Stitch Carries a{' '}
                <span className="italic text-[#B96F48]">Story</span>
              </h2>
              <div className="space-y-4 text-[#8A7968] text-sm leading-relaxed">
                <p>
                  Hi, I&apos;m Priya, and Loop & Loom was born from a simple love for yarn and the quiet joy of creating something beautiful with my own hands.
                </p>
                <p>
                  What started as a hobby during quiet evenings at home grew into a passion. Each piece I create takes hours of careful work — choosing the right yarn, perfecting the tension, and ensuring every stitch is exactly where it should be.
                </p>
                <p>
                  I believe that handmade items carry a warmth that mass-produced things simply cannot replicate. When you wear a Loop & Loom piece, you&apos;re wearing hours of love, patience, and craftsmanship.
                </p>
                <p>
                  Through our courses, I want to share this joy with you — so you too can experience the magic of creating something beautiful from a simple ball of yarn.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#B96F48] hover:underline underline-offset-4"
                >
                  <span>Read More About Us</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ REVIEWS ═══════ */}
        <section className="py-14 md:py-16" aria-label="Customer Reviews">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart size={16} className="text-[#B96F48]" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#B96F48] font-medium">
                Customer Love
              </p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#604734] mb-2">
              What Our Customers Say
            </h2>
            <p className="text-xs text-[#8A7968] italic">(Verified maker feedback from across India)</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8DCCB] hover:border-[#B96F48]/40 transition-all hover:shadow-[0_8px_24px_rgba(96,71,52,0.05)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-0.5 mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-[#E8DCCB]'
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#8A7968] leading-relaxed mb-4 line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-3 border-t border-[#E8DCCB]/60">
                  <div className="w-7 h-7 rounded-full bg-[#B96F48]/10 flex items-center justify-center text-[#B96F48] font-medium text-xs">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#604734]">{review.userName}</p>
                    <p className="text-[10px] text-[#8A7968]">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ NEWSLETTER ═══════ */}
        <section className="py-14 md:py-16 pb-20" aria-label="Newsletter signup">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCB] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-[0_8px_30px_rgba(96,71,52,0.04)]">
            <Send size={24} className="text-[#B96F48] mx-auto mb-3" />
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#604734] mb-2">
              Stay in the Loop
            </h2>
            <p className="text-[#8A7968] text-sm mb-6 max-w-md mx-auto">
              Get notified about new drops, free stitch patterns, course masterclasses, and craft stories.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-[#FBF3E7] border border-[#E8DCCB] rounded-xl text-xs text-[#604734] placeholder:text-[#8A7968] focus:outline-none focus:border-[#B96F48] transition-colors"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#B96F48] text-white rounded-xl font-semibold text-xs hover:bg-[#9E5B37] transition-all hover:scale-[1.02] shadow-[0_4px_16px_rgba(185,111,72,0.25)] whitespace-nowrap"
              >
                {subscribed ? '✓ Subscribed!' : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
