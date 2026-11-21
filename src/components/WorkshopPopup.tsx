'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WorkshopPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only once per browser session
    if (sessionStorage.getItem('workshop-popup-seen')) return;
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('workshop-popup-seen', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(89, 67, 51, 0.45)', backdropFilter: 'blur(4px)' }}
      onClick={dismiss}
    >
      <div
        className="workshop-popup relative max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#FAF3E8', border: '1px solid #D8C4A8' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top bar */}
        <div style={{ height: 6, background: 'linear-gradient(90deg, #A96845 0%, #D8C4A8 50%, #A96845 100%)' }} />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
          style={{ background: '#D8C4A8', color: '#594333' }}
          aria-label="Close popup"
        >
          ✕
        </button>

        <div className="p-6 text-center">
          {/* Animated yarn flower */}
          <div className="workshop-float-anim mx-auto mb-3 w-14 h-14 flex items-center justify-center rounded-full text-3xl"
            style={{ background: '#D8C4A8/40', fontSize: 36 }}>
            🧶
          </div>

          {/* Tagline */}
          <p className="text-[10px] tracking-[0.22em] uppercase font-semibold mb-1"
            style={{ color: '#A96845' }}>
            A little creativity is coming!
          </p>

          {/* Title */}
          <h2 className="font-display text-2xl font-semibold leading-tight mb-4"
            style={{ color: '#594333' }}>
            Loop &amp; Loom<br />
            <span style={{ color: '#A96845' }}>Handmade Workshop</span>
          </h2>

          {/* Activity pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {['💎 Silk Jewellery', '🧶 Crochet', '🎀 Hair Bows', '✨ Scrunchies'].map((act) => (
              <span key={act} className="text-[11px] font-medium px-3 py-1 rounded-full"
                style={{ background: '#D8C4A8', color: '#594333' }}>
                {act}
              </span>
            ))}
          </div>

          {/* Highlight */}
          <div className="rounded-2xl p-3 mb-5"
            style={{ background: '#A96845/10', border: '1px dashed #A96845', backgroundColor: 'rgba(169,104,69,0.08)' }}>
            <p className="text-xs font-semibold" style={{ color: '#594333' }}>
              🎁 Create <strong>10+ beautiful handmade products</strong><br />
              and take them home!
            </p>
          </div>

          {/* Dates summary */}
          <p className="text-[11px] mb-5" style={{ color: '#8A7968' }}>
            Sat 4–7 PM &nbsp;·&nbsp; Sun 10 AM–1 PM &nbsp;·&nbsp; ₹1,299
          </p>

          {/* CTA */}
          <Link
            href="/workshops"
            onClick={dismiss}
            className="block w-full py-3 rounded-2xl text-sm font-bold tracking-wide text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#A96845' }}
          >
            Explore Workshop ✦
          </Link>

          <button onClick={dismiss}
            className="mt-3 text-[11px] hover:underline"
            style={{ color: '#8A7968' }}>
            Maybe later
          </button>
        </div>

        {/* Decorative corner yarn */}
        <div className="absolute bottom-3 left-3 opacity-20 text-2xl select-none pointer-events-none">🌸</div>
        <div className="absolute top-8 left-5 opacity-10 text-lg select-none pointer-events-none rotate-12">🌸</div>
      </div>

      <style jsx>{`
        .workshop-popup {
          animation: workshopPopIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes workshopPopIn {
          from { opacity: 0; transform: scale(0.88) translateY(24px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .workshop-float-anim {
          animation: wsFloat 3s ease-in-out infinite;
        }
        @keyframes wsFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .workshop-popup { animation: none; }
          .workshop-float-anim { animation: none; }
        }
      `}</style>
    </div>
  );
}

