'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { showNotification } from '@/lib/notification-store';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const router = useRouter();
  const { login, signup } = useAuthStore();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignup) {
        if (!formData.name.trim()) { setError('Please enter your full name.'); return; }
        if (!formData.phone.trim()) { setError('Please enter your phone number.'); return; }

        const res = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        });

        if (res.success) {
          setSuccess('Account created! You can now sign in with your credentials.');
          showNotification('Account Created! ✦', 'Welcome to Loop & Loom. You can now sign in.', 'login');
          setIsSignup(false);
          setFormData({ name: '', email: formData.email, password: '', phone: '', address: '' });
        } else {
          setError(res.error ?? 'Sign up failed. Please try again.');
        }
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          showNotification('Welcome Back!', `Signed in as ${formData.email}`, 'login');
          router.push('/dashboard');
        } else {
          setError(res.error ?? 'Incorrect email or password.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup((v) => !v);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#FBF3E7]">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="font-display text-3xl font-semibold text-[#604734] tracking-wide group-hover:text-[#B96F48] transition-colors">
              LOOP &amp; LOOM
            </h1>
            <p className="text-xs tracking-[0.2em] uppercase text-[#8A7968] mt-1">
              Handmade With Love
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-8 shadow-[0_8px_30px_rgba(89,67,51,0.07)]">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9D9C4]/40 border border-[#E8DCCB] text-[#B96F48] text-[10px] font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3 h-3" />
              {isSignup ? 'New Account' : 'Welcome Back'}
            </div>
            <h2 className="font-display text-2xl font-medium text-[#604734]">
              {isSignup ? 'Join Loop & Loom' : 'Sign In'}
            </h2>
            <p className="text-sm text-[#8A7968] mt-1">
              {isSignup
                ? 'Create your account to start shopping'
                : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name — signup only */}
            {isSignup && (
              <Field label="Full Name" htmlFor="name" icon={<User size={15} />}>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={set('name')}
                  placeholder="Your full name"
                  required
                  className={inputClass}
                />
              </Field>
            )}

            {/* Email */}
            <Field label="Email Address" htmlFor="email" icon={<Mail size={15} />}>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </Field>

            {/* Password */}
            <Field label="Password" htmlFor="password" icon={<Lock size={15} />}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={set('password')}
                placeholder="••••••••"
                required
                minLength={6}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7968] hover:text-[#604734] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </Field>

            {/* Phone — signup only */}
            {isSignup && (
              <Field label="Phone Number" htmlFor="phone" icon={<Phone size={15} />}>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={set('phone')}
                  placeholder="+91 98765 43210"
                  required
                  className={inputClass}
                />
              </Field>
            )}

            {/* Delivery Address — signup only */}
            {isSignup && (
              <div>
                <label htmlFor="address" className={labelClass}>
                  Delivery Address <span className="text-[#8A7968] font-normal text-[11px]">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-3.5 text-[#8A7968]" />
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={set('address')}
                    placeholder="Flat / House no., Street, City, PIN code"
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-[#FBF3E7] border border-[#E8DCCB] rounded-xl text-sm text-[#604734] placeholder:text-[#8A7968] focus:outline-none focus:border-[#B96F48] transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {/* Forgot password */}
            {!isSignup && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[#B96F48] hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error / Success banners */}
            {error && (
              <p className="text-sm text-[#C25B4A] bg-[#C25B4A]/10 px-4 py-2.5 rounded-xl border border-[#C25B4A]/20">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-[#4A7C59] bg-[#4A7C59]/10 px-4 py-2.5 rounded-xl border border-[#4A7C59]/20">
                {success}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#B96F48] hover:bg-[#9E5B37] text-white rounded-xl font-medium text-sm transition-all hover:scale-[1.01] disabled:opacity-50 shadow-[0_4px_14px_rgba(185,111,72,0.25)]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Toggle sign-in / sign-up */}
          <p className="text-sm text-[#8A7968] text-center mt-6">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={switchMode} className="text-[#B96F48] font-medium hover:underline">
              {isSignup ? 'Sign In' : 'Sign Up Free'}
            </button>
          </p>
        </div>

        <p className="text-xs text-[#8A7968] text-center mt-5">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-[#B96F48] hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[#B96F48] hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

/* ── helpers ─────────────────────────────────────────────────────── */
const inputClass =
  'w-full pl-10 pr-4 py-3 bg-[#FBF3E7] border border-[#E8DCCB] rounded-xl text-sm text-[#604734] placeholder:text-[#8A7968] focus:outline-none focus:border-[#B96F48] transition-colors';

const labelClass = 'block text-sm font-medium text-[#604734] mb-1.5';

function Field({
  label,
  htmlFor,
  icon,
  children,
}: {
  label: string;
  htmlFor: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7968]">{icon}</span>
        {children}
      </div>
    </div>
  );
}
