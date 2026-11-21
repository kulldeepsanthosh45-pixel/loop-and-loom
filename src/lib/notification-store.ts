'use client';

import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'order' | 'login' | 'cart' | 'admin' | 'info';
  duration?: number;
}

interface NotificationState {
  current: NotificationItem | null;
  notify: (item: Omit<NotificationItem, 'id'>) => void;
  dismiss: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  current: null,

  notify: (item) => {
    const id = `notif-${Date.now()}`;
    const newItem: NotificationItem = { id, ...item };
    set({ current: newItem });

    const timeout = item.duration || 4500;
    setTimeout(() => {
      set((state) => (state.current?.id === id ? { current: null } : state));
    }, timeout);
  },

  dismiss: () => set({ current: null }),
}));

/** Global helper to easily trigger notifications from anywhere */
export function showNotification(
  title: string,
  message?: string,
  type: NotificationItem['type'] = 'success',
  duration = 4500
) {
  useNotificationStore.getState().notify({ title, message, type, duration });
}
