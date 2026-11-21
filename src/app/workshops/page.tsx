'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Users, Package, Star, ChevronRight } from 'lucide-react';
import { WORKSHOP_CONFIG } from '@/lib/workshop-config';

const activities = WORKSHOP_CONFIG.activities;

const highlights = [
  { icon: Package, text: 'All materials provided — nothing to bring!' },
  { icon: Star, text: 'No previous experience required' },
  { icon: '🎁', text: 'Take home 10+ handmade products' },
  { icon: Users, text: 'Beginner-friendly, hands-on sessions' },
  { icon: '⏳', text: 'Limited seats — register early!' },
];

const activityImages: Record<string, string> = {
  'silk-jewellery': '/images/workshops/silk-jewellery.jpg',
  'crochet':        '/images/workshops/crochet.jpg',
  'hair-bow':       '/images/workshops/hair-bow.jpg',
  'scrunchie':      '/images/workshops/scrunchie.jpg',
};

const activityIcons: Record<string, string> = {
  'silk-jewellery': '💎',
  'crochet':        '🧶',
  'hair-bow':       '🎀',
  'scrunchie':      '🌸',
};

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen" style={{ background: '#FAF3E8' }}>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 overflow-hidden" style={{ background: '#FAF3E8' }}>
        {/* Floating doodles */}
        <div className="absolute top-8 left-6 text-5xl opacity-10 select-none pointer-events-none animate-float-slow">🧶</div>
        <div className="absolute top-12 right-8 text-4xl opacity-10 select-none pointer-events-none animate-float-reverse">🌸</div>
        <div className="absolute bottom-6 left-16 text-3xl opacity-10 select-none pointer-events-none animate-sticker-2">🎀</div>

        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-[11px] tracking-[0.22em] uppercase font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(169,104,69,0.12)', color: '#A96845', border: '1px solid rgba(169,104,69,0.25)' }}>
            ✦ Loop &amp; Loom Handmade Workshop ✦
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-5"
            style={{ color: '#594333' }}>
            Create Something Beautiful<br />
            <span style={{ color: '#A96845' }}>With Your Own Hands</span>
          </h1>

          <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
            style={{ color: '#8A7968' }}>
            Join us for a creative handmade experience filled with colours, crafts and creativity.
            Walk away with over 10 beautiful items you made yourself.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/workshops/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
              style={{ background: '#A96845' }}>
              Register Now ✦
              <ChevronRight size={16} />
            </Link>
            <a href="#sessions"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold transition-all hover:bg-[#D8C4A8]/30"
              style={{ color: '#594333', border: '1px solid #D8C4A8' }}>
              View Sessions
            </a>
          </div>
        </div>
      </section>

      {/* ── ACTIVITIES GRID ────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with delicate artisan flourishes */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-[#A96845] opacity-50 text-base select-none">♡</span>
              <span className="w-10 h-0.5 bg-[#D8C4A8]/60 inline-block rounded-full"></span>
              <span className="text-2xl select-none">🧶</span>
              <span className="w-10 h-0.5 bg-[#D8C4A8]/60 inline-block rounded-full"></span>
              <span className="text-[#A96845] opacity-50 text-base select-none">♡</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-semibold mb-2" style={{ color: '#594333' }}>
              What You&apos;ll Create
            </h2>
            <p className="text-sm sm:text-base font-serif italic mb-2" style={{ color: '#8A7968' }}>
              Four beautiful crafts. One unforgettable creative experience.
            </p>
            <div className="flex justify-center">
              <span className="text-xs text-[#A96845] opacity-70">🤎</span>
            </div>
          </div>

          {/* Responsive 4-Card Grid (4 on desktop, 2 on tablet, 1 on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((act) => (
              <div
                key={act.id}
                className="workshop-card bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#E8DCCB] shadow-[0_4px_20px_rgba(89,67,51,0.06)] hover:shadow-[0_12px_32px_rgba(89,67,51,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group"
              >
                {/* 4:3 Aspect Ratio Image with rounded top corners */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF3E8]">
                  <Image
                    src={activityImages[act.id]}
                    alt={act.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Overlapping Circular Icon Badge */}
                <div className="relative flex justify-center -mt-5 z-10 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3E8] border border-[#D8C4A8] shadow-sm flex items-center justify-center text-base">
                    <span>{activityIcons[act.id] || act.emoji}</span>
                  </div>
                </div>

                {/* Card Text Content (Cleanly aligned, never overlaps image) */}
                <div className="p-5 pt-3 text-center flex flex-col flex-grow justify-start">
                  <h3 className="font-display text-lg font-semibold mb-2" style={{ color: '#594333' }}>
                    {act.label}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#8A7968' }}>
                    {act.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ─────────────────────────────────────────────── */}
      <section className="py-12 px-4" style={{ background: 'rgba(216,196,168,0.2)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: '#FFFDF9', border: '1px solid #E8DCCB' }}>
                <span className="text-xl mt-0.5">{typeof h.icon === 'string' ? h.icon : ''}</span>
                {typeof h.icon !== 'string' && (
                  <h.icon size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#A96845' }} />
                )}
                <p className="text-sm font-medium" style={{ color: '#594333' }}>{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SESSION DETAILS ────────────────────────────────────────── */}
      <section id="sessions" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3" style={{ color: '#594333' }}>
              Session Timings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[WORKSHOP_CONFIG.saturday, WORKSHOP_CONFIG.sunday].map((s) => (
              <div key={s.key} className="rounded-2xl p-6 text-center shadow-sm"
                style={{ background: '#FFFDF9', border: '2px solid #D8C4A8' }}>
                <div className="text-3xl mb-3">🗓️</div>
                <h3 className="font-display text-2xl font-semibold mb-1" style={{ color: '#594333' }}>
                  {s.label}
                </h3>
                <p className="text-sm font-medium mb-2" style={{ color: '#A96845' }}>{s.date}</p>
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#8A7968' }}>
                  <Clock size={14} />
                  {s.time}
                </div>
              </div>
            ))}
          </div>

          {/* Venue */}
          <div className="rounded-2xl p-6 flex items-start gap-4"
            style={{ background: '#FFFDF9', border: '1px solid #E8DCCB' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(169,104,69,0.12)' }}>
              <MapPin size={18} style={{ color: '#A96845' }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A96845' }}>Venue</p>
              <p className="font-semibold text-sm mb-1" style={{ color: '#594333' }}>
                {WORKSHOP_CONFIG.venue.name}
              </p>
              <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#8A7968' }}>
                {WORKSHOP_CONFIG.venue.address}
              </p>
              <a href={WORKSHOP_CONFIG.venue.mapUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs font-semibold hover:underline"
                style={{ color: '#A96845' }}>
                Open in Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING & CTA ───────────────────────────────────────────── */}
      <section className="py-16 px-4 text-center" style={{ background: '#594333' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🎀</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3 text-white">
            Only {WORKSHOP_CONFIG.feeDisplay} per person
          </h2>
          <p className="text-sm mb-2" style={{ color: '#D8C4A8' }}>
            All materials included · Certificate of participation · 10+ handmade products to take home
          </p>
          <p className="text-xs mb-8 font-semibold uppercase tracking-widest"
            style={{ color: '#A96845' }}>
            ⚠ Limited seats available — book yours today!
          </p>
          <Link href="/workshops/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-sm font-bold transition-all hover:opacity-90 shadow-xl"
            style={{ background: '#A96845', color: '#fff' }}>
            Register Now — {WORKSHOP_CONFIG.feeDisplay} ✦
          </Link>
        </div>
      </section>

      <style jsx>{`
        .workshop-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .workshop-card { transition: none; }
        }
      `}</style>
    </main>
  );
}

