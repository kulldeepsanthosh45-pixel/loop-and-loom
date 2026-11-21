'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  Play, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ExternalLink, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { courses, products } from '@/lib/data';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'courses' | 'orders' | 'wishlist' | 'settings'>('courses');

  // Enrolled courses list
  const enrolledCourses = courses.filter((c) => 
    user?.enrolledCourses?.includes(c.id) || c.id === 'course-1'
  );

  // Sample order history
  const sampleOrders = [
    {
      id: 'LL-849201',
      date: '12 October 2026',
      total: 1899,
      status: 'Shipped',
      trackingNumber: 'DELHIVERY-98402192',
      items: [
        {
          name: 'Granny Square Tote Bag',
          variant: 'Terracotta / Standard',
          price: 1899,
          image: '/images/product-bag.jpg',
        },
      ],
    },
    {
      id: 'LL-731940',
      date: '28 September 2026',
      total: 699,
      status: 'Delivered',
      trackingNumber: 'BLUEDART-55102941',
      items: [
        {
          name: 'Crochet Headband Set',
          variant: 'Pastel Pack',
          price: 699,
          image: '/images/product-hairband.jpg',
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header Banner */}
        <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 text-accent font-display text-2xl font-bold flex items-center justify-center border-2 border-accent/40">
              {user?.name ? user.name[0].toUpperCase() : 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl text-text">
                  Welcome back, {user?.name || 'Makers & Crafters'}
                </h1>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <p className="text-xs text-muted mt-0.5">{user?.email || 'crafter@loopandloom.in'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/courses"
              className="flex-1 sm:flex-initial text-xs font-semibold bg-accent text-card px-4 py-2.5 rounded-xl hover:bg-accent/90 transition-all text-center"
            >
              Browse Courses
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 sm:flex-initial text-xs font-semibold border border-border text-muted hover:text-text px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 sm:gap-4 border-b border-border pb-4 mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'courses'
                ? 'bg-accent text-card shadow-sm'
                : 'bg-card text-muted hover:text-text border border-border'
            }`}
          >
            <BookOpen className="w-4 h-4" /> My Courses ({enrolledCourses.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'orders'
                ? 'bg-accent text-card shadow-sm'
                : 'bg-card text-muted hover:text-text border border-border'
            }`}
          >
            <Package className="w-4 h-4" /> Orders ({sampleOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'wishlist'
                ? 'bg-accent text-card shadow-sm'
                : 'bg-card text-muted hover:text-text border border-border'
            }`}
          >
            <Heart className="w-4 h-4" /> Wishlist (3)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'settings'
                ? 'bg-accent text-card shadow-sm'
                : 'bg-card text-muted hover:text-text border border-border'
            }`}
          >
            <Settings className="w-4 h-4" /> Profile &amp; Address
          </button>
        </div>

        {/* TAB 1: Enrolled Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-text">Your Enrolled Masterclasses</h2>
                <p className="text-xs text-muted mt-0.5">Resume video lessons right from where you paused.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, idx) => {
                const simulatedProgress = idx === 0 ? 65 : 20;
                return (
                  <div
                    key={course.id}
                    className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="relative aspect-video w-full">
                      <Image
                        src={course.image || '/images/hero-banner.jpg'}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-text text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {course.level}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-xl text-text mb-1 line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-muted mb-4">Mentor: {course.instructor}</p>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-muted">Course Progress</span>
                            <span className="font-semibold text-accent">{simulatedProgress}%</span>
                          </div>
                          <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-accent h-full rounded-full transition-all duration-300"
                              style={{ width: `${simulatedProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/learn/${course.slug}`}
                        className="w-full bg-accent text-card text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-card" /> Resume Learning
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-text">Order History &amp; Tracking</h2>
            <div className="space-y-4">
              {sampleOrders.map((order) => (
                <div key={order.id} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-border gap-2">
                    <div>
                      <span className="text-xs font-semibold text-text">Order #{order.id}</span>
                      <p className="text-[11px] text-muted">Placed on {order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> {order.status}
                      </span>
                      <span className="text-sm font-semibold text-accent">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="py-4 divide-y divide-border/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-2">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-text">{item.name}</h4>
                          <span className="text-[10px] text-muted">{item.variant}</span>
                        </div>
                        <span className="text-xs font-semibold text-text">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-muted gap-2">
                    <span>AWB Tracking: <strong className="text-text font-mono">{order.trackingNumber}</strong></span>
                    <button
                      type="button"
                      onClick={() => alert(`Tracking package #${order.trackingNumber} on Delhivery...`)}
                      className="font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      Track Package <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-text">Your Saved Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-card rounded-2xl border border-border p-4 flex flex-col justify-between">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3">
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-text">{item.name}</h3>
                    <span className="text-xs font-semibold text-accent">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="mt-4 w-full bg-accent text-card text-xs font-semibold py-2 rounded-xl text-center hover:bg-accent/90"
                  >
                    View Product
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Profile & Settings */}
        {activeTab === 'settings' && (
          <div className="bg-card rounded-2xl border border-border p-6 max-w-xl">
            <h2 className="font-display text-2xl text-text mb-4">Account &amp; Shipping Details</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                const address = (form.elements.namedItem('address') as HTMLTextAreaElement).value;
                const { updateProfile } = useAuthStore.getState();
                const ok = await updateProfile({ name, phone, address });
                alert(ok ? 'Profile updated in Supabase!' : 'Failed to update profile.');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase mb-1">User ID</label>
                <input
                  type="text"
                  value={user?.id || 'Not logged in'}
                  disabled
                  className="w-full p-2.5 rounded-xl border border-border bg-bg/50 text-muted font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.name || ''}
                  className="w-full p-2.5 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                  className="w-full p-2.5 rounded-xl border border-border bg-bg/50 text-muted"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={user?.phone || ''}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase mb-1">Delivery Address</label>
                <textarea
                  name="address"
                  rows={3}
                  defaultValue={user?.address || ''}
                  placeholder="Street, Landmark, City, State, PIN"
                  className="w-full p-2.5 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-accent text-card font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 text-xs"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
