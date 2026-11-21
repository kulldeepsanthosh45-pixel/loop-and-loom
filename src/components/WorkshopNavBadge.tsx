'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Small "NEW" badge pulsing badge for Workshops nav item */
export default function WorkshopNavBadge() {
  const pathname = usePathname();
  const isActive = pathname?.startsWith('/workshops');

  return (
    <Link
      href="/workshops"
      className="relative nav-liquid-item flex items-center gap-1.5"
      style={isActive ? { color: '#FFFFFF', fontWeight: 700 } : {}}
    >
      Workshops
      <span
        className="inline-flex items-center text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
        style={{ background: '#A96845', color: '#fff', animation: 'wsPulse 2s ease-in-out infinite' }}
      >
        NEW
      </span>
      <style jsx>{`
        @keyframes wsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none; }
        }
      `}</style>
    </Link>
  );
}

