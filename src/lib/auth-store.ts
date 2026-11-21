'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: 'admin' | 'customer';
  image?: string;
  enrolledCourses: string[];
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { phone?: string; address?: string; name?: string; role?: 'admin' | 'customer' }) => Promise<boolean>;
  setRole: (role: 'admin' | 'customer') => void;
  enrollInCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  loadUserFromSupabase: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      /** Sign in with email + password via Supabase Auth */
      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) {
          return { success: false, error: error?.message ?? 'Login failed' };
        }

        // Fetch profile (phone, address, name, role)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userRole: 'admin' | 'customer' =
          profile?.role === 'admin' || email.toLowerCase() === 'kulldeepsanthosh45@gmail.com'
            ? 'admin'
            : 'customer';

        const user: AuthUser = {
          id: data.user.id,
          name: profile?.name ?? email.split('@')[0],
          email: data.user.email ?? email,
          phone: profile?.phone ?? undefined,
          address: profile?.address ?? undefined,
          role: userRole,
          enrolledCourses: get().user?.enrolledCourses ?? [],
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      /** Sign up with email + password + phone & address */
      signup: async ({ name, email, password, phone, address }) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone: phone ?? '',
              address: address ?? '',
            },
          },
        });

        if (error || !data.user) {
          return { success: false, error: error?.message ?? 'Sign up failed' };
        }

        // If a session exists (email confirmation disabled in Supabase), also update the table directly
        if (data.session) {
          try {
            await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                name,
                email,
                phone: phone ?? null,
                address: address ?? null,
              });
          } catch {
            // Handled by database trigger
          }
        }

        const user: AuthUser = {
          id: data.user.id,
          name,
          email,
          phone: phone ?? undefined,
          address: address ?? undefined,
          enrolledCourses: [],
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      /** Google OAuth */
      loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/dashboard` },
        });
        return !error;
      },

      /** Sign out */
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      /** Update phone / address / name in Supabase */
      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return false;
        const { error } = await supabase
          .from('profiles')
          .update(data)
          .eq('id', user.id);
        if (!error) {
          set({ user: { ...user, ...data } });
        }
        return !error;
      },

      /** Set role explicitly (e.g. for testing or promotion) */
      setRole: (role: 'admin' | 'customer') => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, role } });
        }
      },

      /** Re-hydrate user from Supabase session (call on app start) */
      loadUserFromSupabase: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const userEmail = session.user.email ?? '';
        const userRole: 'admin' | 'customer' =
          profile?.role === 'admin' || userEmail.toLowerCase() === 'kulldeepsanthosh45@gmail.com'
            ? 'admin'
            : 'customer';

        const user: AuthUser = {
          id: session.user.id,
          name: profile?.name ?? userEmail.split('@')[0] ?? '',
          email: userEmail,
          phone: profile?.phone ?? undefined,
          address: profile?.address ?? undefined,
          role: userRole,
          enrolledCourses: get().user?.enrolledCourses ?? [],
        };
        set({ user, isAuthenticated: true });
      },

      enrollInCourse: (courseId: string) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, enrolledCourses: [...user.enrolledCourses, courseId] } });
        }
      },

      isEnrolled: (courseId: string) => {
        return get().user?.enrolledCourses.includes(courseId) ?? false;
      },
    }),
    { name: 'loop-loom-auth' }
  )
);
