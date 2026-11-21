'use client';

import { useNotificationStore } from '@/lib/notification-store';
import {
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  PackageCheck,
  UserCheck,
  X,
} from 'lucide-react';

export default function LiquidNotification() {
  const { current, dismiss } = useNotificationStore();

  if (!current) return null;

  const getIcon = () => {
    switch (current.type) {
      case 'order':
        return <PackageCheck className="w-5 h-5 text-[#B96F48] animate-bounce" />;
      case 'login':
        return <UserCheck className="w-5 h-5 text-[#B96F48]" />;
      case 'cart':
        return <ShoppingBag className="w-5 h-5 text-[#B96F48]" />;
      case 'admin':
        return <Sparkles className="w-5 h-5 text-[#B96F48] animate-spin" style={{ animationDuration: '4s' }} />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#B96F48]" />;
    }
  };

  return (
    <aside
      aria-label="Liquid notification"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
    >
      <div className="liquid-notification-warm rounded-full px-5 py-3 flex items-center gap-3.5 max-w-[92vw] sm:max-w-md shadow-md">
        {/* Subtle Warm Glass Icon Sphere */}
        <div className="w-8 h-8 rounded-full bg-[#B96F48]/12 border border-[#B96F48]/25 flex items-center justify-center flex-shrink-0 shadow-sm">
          {getIcon()}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-[#604734] tracking-wide truncate">
              {current.title}
            </h4>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B96F48] animate-pulse" />
          </div>
          {current.message && (
            <p className="text-[11px] text-[#8A7664] truncate font-body">
              {current.message}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={dismiss}
          className="text-[#8A7664] hover:text-[#604734] p-1 rounded-full hover:bg-[#604734]/5 transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
