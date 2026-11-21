'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  PackagePlus,
  GraduationCap,
  Layers,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Tag,
  ShieldCheck,
  Eye,
  Camera,
  Coins,
  Clock,
  Heart,
  Palette,
  Users,
  UserCheck,
  Search,
  CalendarDays,
  CheckCheck,
  XCircle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { products as initialProducts, courses as initialCourses, categories } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { Product, Course } from '@/lib/types';
import { showNotification } from '@/lib/notification-store';
import { WorkshopRegistration } from '@/lib/workshop-types';
import { WORKSHOP_CONFIG } from '@/lib/workshop-config';

interface UserProfileRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'customer';
  created_at?: string;
}

// Preset artisan crochet images Mom can easily pick from
const PRESET_PRODUCT_IMAGES = [
  { label: 'Tote Bag (Terracotta)', url: '/images/product-bag.jpg' },
  { label: 'Pastel Headband', url: '/images/product-hairband.jpg' },
  { label: 'Daisy Earrings', url: '/images/product-earrings.jpg' },
  { label: 'Ribbed Scrunchie', url: '/images/product-scrunchie.jpg' },
  { label: 'Studio Showcase', url: '/images/hero-banner.jpg' },
  { label: 'Maker Workshop', url: '/images/maker-portrait.jpg' },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, setRole } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'product' | 'course' | 'inventory' | 'users' | 'workshops'>('product');

  // ── Workshop State ──────────────────────────────────────────────────
  const [workshopRegs, setWorkshopRegs] = useState<WorkshopRegistration[]>([]);
  const [workshopLoading, setWorkshopLoading] = useState(false);
  const [wsSearch, setWsSearch] = useState('');
  const [wsStatusFilter, setWsStatusFilter] = useState<'ALL' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'REJECTED'>('ALL');
  const [wsSessionFilter, setWsSessionFilter] = useState<'ALL' | 'saturday' | 'sunday'>('ALL');
  const [wsAdminNote, setWsAdminNote] = useState<Record<string, string>>({});
  const [wsActionLoading, setWsActionLoading] = useState<string | null>(null);

  // Workshop settings
  const [wsSettings, setWsSettings] = useState({
    saturday_date: WORKSHOP_CONFIG.saturday.date,
    sunday_date: WORKSHOP_CONFIG.sunday.date,
    saturday_time: WORKSHOP_CONFIG.saturday.time,
    sunday_time: WORKSHOP_CONFIG.sunday.time,
    fee: WORKSHOP_CONFIG.fee,
    max_seats_saturday: WORKSHOP_CONFIG.maxSeatsPerSession,
    max_seats_sunday: WORKSHOP_CONFIG.maxSeatsPerSession,
    registration_open: true,
  });
  const [wsSaving, setWsSaving] = useState(false);

  // Products & Courses state (initialized with current catalog)
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [courseList, setCourseList] = useState<Course[]>(initialCourses);

  // Users state
  const [usersList, setUsersList] = useState<UserProfileRecord[]>([
    {
      id: '2ad6994b-3d8d-4a68-a1fc-432b8c1c5741',
      name: 'Kulldeep Santhosh',
      email: 'kulldeepsanthosh45@gmail.com',
      phone: '+91 98765 43210',
      address: 'Bengaluru, Karnataka - 560001',
      role: 'admin',
      created_at: '17 Oct 2026, 17:45',
    },
  ]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Success / Error banners
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Form State: New Product ─────────────────────────────────────────
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'bags',
    price: '',
    comparePrice: '',
    material: '100% Organic Soft Cotton Yarn',
    stock: '15',
    craftTime: '8 Hours',
    colors: 'Terracotta, Natural Cream, Sage Green',
    description: '',
    imageUrl: '/images/product-bag.jpg',
    isFeatured: true,
    isBestSeller: true,
  });

  // ── Form State: New Course ──────────────────────────────────────────
  const [courseForm, setCourseForm] = useState({
    title: '',
    instructor: 'Mom · Master Crochet Artisan',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    price: '999',
    comparePrice: '1999',
    duration: '4.5 Hours',
    lessonCount: '12',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: '/images/hero-banner.jpg',
    description: '',
  });

  // ── Workshop: Load registrations ───────────────────────────────────
  const loadWorkshopRegs = async () => {
    setWorkshopLoading(true);
    const { data } = await supabase
      .from('workshop_registrations')
      .select('*')
      .order('created_at', { ascending: false });
    setWorkshopRegs((data as WorkshopRegistration[]) ?? []);
    setWorkshopLoading(false);
  };

  const loadWsSettings = async () => {
    const { data } = await supabase.from('workshop_settings').select('*').single();
    if (data) setWsSettings(data);
  };

  useEffect(() => {
    if (activeTab === 'workshops') {
      loadWorkshopRegs();
      loadWsSettings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ── Workshop: Confirm / Reject payment ────────────────────────────
  const handleVerifyPayment = async (reg: WorkshopRegistration, action: 'CONFIRMED' | 'REJECTED') => {
    if (wsActionLoading) return;
    if (!confirm(`${action === 'CONFIRMED' ? 'CONFIRM' : 'REJECT'} payment for ${reg.full_name}?`)) return;
    setWsActionLoading(reg.id);
    const { error } = await supabase
      .from('workshop_registrations')
      .update({
        payment_status: action,
        verified_at: new Date().toISOString(),
        verified_by: user?.email ?? 'admin',
        admin_notes: wsAdminNote[reg.id] ?? reg.admin_notes ?? null,
      })
      .eq('id', reg.id)
      .neq('payment_status', action); // idempotency guard

    if (!error) {
      setWorkshopRegs((prev) => prev.map((r) => r.id === reg.id
        ? { ...r, payment_status: action, verified_at: new Date().toISOString() }
        : r));
      showNotification(
        action === 'CONFIRMED' ? 'Payment Confirmed ✓' : 'Payment Rejected',
        `${reg.full_name} — ${reg.registration_id}`,
        'admin'
      );
    }
    setWsActionLoading(null);
  };

  // ── Workshop: Save settings ────────────────────────────────────────
  const handleSaveWsSettings = async () => {
    setWsSaving(true);
    await supabase.from('workshop_settings')
      .update({ ...wsSettings, updated_at: new Date().toISOString() })
      .eq('id', '00000000-0000-0000-0000-000000000001');
    setWsSaving(false);
    showNotification('Settings Saved ✦', 'Workshop settings updated.', 'admin');
  };

  // ── Workshop: CSV Export ───────────────────────────────────────────
  const exportWorkshopCSV = () => {
    const rows = [
      ['Registration ID','Name','Mobile','WhatsApp','Email','Age Group','Session','Craft Interests','UTR','Payment Status','Amount','Registered At','Verified At'],
      ...workshopRegs.map((r) => [
        r.registration_id, r.full_name, r.mobile, r.whatsapp,
        r.email ?? '', r.age_group, r.session,
        r.craft_interests.join('; '), r.utr ?? '',
        r.payment_status, r.amount,
        r.created_at, r.verified_at ?? '',
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `workshop-registrations-${Date.now()}.csv`;
    a.click();
  };

  // Check admin role
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'kulldeepsanthosh45@gmail.com';

  // ── Handler: Submit Product ─────────────────────────────────────────
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a product name.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const priceNum = parseInt(productForm.price) || 999;
    const comparePriceNum = parseInt(productForm.comparePrice) || undefined;
    const stockNum = parseInt(productForm.stock) || 10;
    const slug = productForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const selectedCat = categories.find((c) => c.slug === productForm.category) || categories[0];

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      name: productForm.name,
      description:
        productForm.description ||
        `Exquisitely hand-crocheted using ${productForm.material}. Each piece takes approximately ${productForm.craftTime} to shape with care and precision.`,
      price: priceNum,
      comparePrice: comparePriceNum,
      images: [productForm.imageUrl, '/images/hero-banner.jpg'],
      category: selectedCat.name,
      categorySlug: selectedCat.slug,
      material: productForm.material,
      colors: productForm.colors.split(',').map((s) => s.trim()).filter(Boolean),
      stock: stockNum,
      isNew: true,
      isFeatured: productForm.isFeatured,
      rating: 5.0,
      reviewCount: 1,
    };

    try {
      // 1. Save to Supabase products table (if exists)
      await supabase.from('products').insert([
        {
          id: newProduct.id,
          name: newProduct.name,
          slug: newProduct.slug,
          price: newProduct.price,
          description: newProduct.description,
          image_url: productForm.imageUrl,
          category: newProduct.category,
          stock: newProduct.stock,
          material: newProduct.material,
        },
      ]);
    } catch {
      // Non-blocking if table is still strictly local
    }

    // 2. Add to active store state
    setProductList((prev) => [newProduct, ...prev]);
    setIsSubmitting(false);
    showNotification('Product Published! ✦', `"${newProduct.name}" is now live in the shop!`, 'admin');
    setStatusMessage({
      type: 'success',
      text: `🎉 "${newProduct.name}" published successfully! It is now live in the store.`,
    });

    // Reset form
    setProductForm({
      name: '',
      category: 'bags',
      price: '',
      comparePrice: '',
      material: '100% Organic Soft Cotton Yarn',
      stock: '15',
      craftTime: '8 Hours',
      colors: 'Terracotta, Natural Cream, Sage Green',
      description: '',
      imageUrl: '/images/product-bag.jpg',
      isFeatured: true,
      isBestSeller: true,
    });
  };

  // ── Handler: Submit Course ──────────────────────────────────────────
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a course title.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const priceNum = parseInt(courseForm.price) || 999;
    const comparePriceNum = parseInt(courseForm.comparePrice) || undefined;
    const lessonsNum = parseInt(courseForm.lessonCount) || 8;
    const slug = courseForm.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      title: courseForm.title,
      description:
        courseForm.description ||
        'Master the art of handmade crochet step-by-step with high-definition video masterclasses led by our head artisan.',
      instructor: courseForm.instructor,
      price: priceNum,
      comparePrice: comparePriceNum,
      image: courseForm.imageUrl,
      level: courseForm.level,
      duration: courseForm.duration,
      lessonCount: lessonsNum,
      studentCount: 1,
      rating: 5.0,
      reviewCount: 1,
      isFeatured: true,
      modules: [
        {
          id: 'mod-1',
          title: 'Foundations & Yarn Selection',
          lessons: [
            { id: 'les-1', title: 'Welcome & Supplies Checklist', duration: '12 min', isPreview: true },
            { id: 'les-2', title: 'Mastering the Magic Ring & Slip Stitch', duration: '28 min', isPreview: false },
          ],
        },
        {
          id: 'mod-2',
          title: 'Hands-on Pattern Execution',
          lessons: [
            { id: 'les-3', title: 'Row-by-Row Stitching Walkthrough', duration: '45 min', isPreview: false },
            { id: 'les-4', title: 'Finishing, Weaving Ends & Care', duration: '20 min', isPreview: false },
          ],
        },
      ],
    };

    try {
      await supabase.from('courses').insert([
        {
          id: newCourse.id,
          title: newCourse.title,
          slug: newCourse.slug,
          price: newCourse.price,
          description: newCourse.description,
          instructor: newCourse.instructor,
          image_url: newCourse.image,
          level: newCourse.level,
          duration: newCourse.duration,
        },
      ]);
    } catch {
      // Non-blocking
    }

    setCourseList((prev) => [newCourse, ...prev]);
    setIsSubmitting(false);
    showNotification('Masterclass Live! 🎓', `"${newCourse.title}" published for students!`, 'admin');
    setStatusMessage({
      type: 'success',
      text: `🎉 Masterclass "${newCourse.title}" published! Students can now enroll and watch.`,
    });

    setCourseForm({
      title: '',
      instructor: 'Mom · Master Crochet Artisan',
      level: 'Beginner',
      price: '999',
      comparePrice: '1999',
      duration: '4.5 Hours',
      lessonCount: '12',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      imageUrl: '/images/hero-banner.jpg',
      description: '',
    });
  };

  // ── Access Protection Screen ────────────────────────────────────────
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="pt-28 pb-24 min-h-[80vh] flex items-center justify-center bg-[#FBF3E7] px-4">
        <div className="max-w-md w-full bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-8 text-center shadow-[0_8px_30px_rgba(89,67,51,0.08)]">
          <div className="w-16 h-16 rounded-full bg-[#B96F48]/15 text-[#B96F48] flex items-center justify-center mx-auto mb-4 border border-[#B96F48]/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-[#604734] mb-2">
            Mom&apos;s Artisan Studio
          </h1>
          <p className="text-xs text-[#8A7968] leading-relaxed mb-6">
            This portal allows your mom to add new handmade crochet products, manage store inventory, and publish video masterclasses.
          </p>

          <div className="bg-[#FBF3E7] rounded-xl p-4 border border-[#E8DCCB] text-xs text-left text-[#604734] mb-6 space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#B96F48]" />
              Current Status: {isAuthenticated ? `Logged in as ${user?.email}` : 'Not logged in'}
            </div>
            <p className="text-[11px] text-[#8A7968]">
              Role: <strong className="text-[#604734] uppercase">{user?.role || 'Customer'}</strong>
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setRole('admin');
              }}
              className="w-full bg-[#B96F48] hover:bg-[#9E5B37] text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-amber-200" />
              Enable Admin Access for This Session
            </button>

            {!isAuthenticated && (
              <Link
                href="/login"
                className="block w-full border border-[#E8DCCB] text-[#604734] hover:bg-[#FBF3E7] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all"
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#FBF3E7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Studio Top Header */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCB] p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#B96F48]/15 text-[#B96F48] flex items-center justify-center border-2 border-[#B96F48]/30 flex-shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B96F48] bg-[#E9D9C4]/40 px-2.5 py-0.5 rounded-full border border-[#E8DCCB]">
                  Studio Manager
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded-full">
                  Admin Active
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-[#604734] mt-1 font-semibold">
                Mom&apos;s Crochet Creation Studio
              </h1>
              <p className="text-xs text-[#8A7968] mt-0.5">
                Add new handmade creations to the shop, publish video masterclasses, and manage catalog items.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/shop"
              target="_blank"
              className="flex-1 sm:flex-initial text-xs font-semibold border border-[#E8DCCB] text-[#604734] hover:bg-[#FBF3E7] px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live Shop
            </Link>
            <Link
              href="/courses"
              target="_blank"
              className="flex-1 sm:flex-initial text-xs font-semibold border border-[#E8DCCB] text-[#604734] hover:bg-[#FBF3E7] px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live Courses
            </Link>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl border mb-6 flex items-center justify-between text-xs font-medium animate-in fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs text-[#8A7968] hover:text-[#604734]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 sm:gap-4 border-b border-[#E8DCCB] pb-4 mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('product')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'product'
                ? 'bg-[#B96F48] text-white shadow-sm'
                : 'bg-[#FFFDF9] text-[#8A7968] hover:text-[#604734] border border-[#E8DCCB]'
            }`}
          >
            <PackagePlus className="w-4 h-4" /> Add New Product
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('course')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'course'
                ? 'bg-[#B96F48] text-white shadow-sm'
                : 'bg-[#FFFDF9] text-[#8A7968] hover:text-[#604734] border border-[#E8DCCB]'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Add Masterclass / Course
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-[#B96F48] text-white shadow-sm'
                : 'bg-[#FFFDF9] text-[#8A7968] hover:text-[#604734] border border-[#E8DCCB]'
            }`}
          >
            <Layers className="w-4 h-4" /> Catalog Overview ({productList.length} Products · {courseList.length} Courses)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'users'
                ? 'bg-[#B96F48] text-white shadow-sm'
                : 'bg-[#FFFDF9] text-[#8A7968] hover:text-[#604734] border border-[#E8DCCB]'
            }`}
          >
            <Users className="w-4 h-4" /> Customer &amp; User Accounts ({usersList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workshops')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'workshops'
                ? 'text-white shadow-sm'
                : 'bg-[#FFFDF9] text-[#8A7968] hover:text-[#604734] border border-[#E8DCCB]'
            }`}
            style={activeTab === 'workshops' ? { background: '#A96845' } : {}}
          >
            <CalendarDays className="w-4 h-4" /> Workshop Registrations
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: activeTab === 'workshops' ? 'rgba(255,255,255,0.3)' : '#A96845', color: '#fff' }}>NEW</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 5: WORKSHOP REGISTRATIONS                                   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'workshops' && (
          <div className="space-y-6">

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Registrations', value: workshopRegs.length, color: '#594333' },
                { label: 'Confirmed', value: workshopRegs.filter(r => r.payment_status === 'CONFIRMED').length, color: '#6B8E6B' },
                { label: 'Pending', value: workshopRegs.filter(r => r.payment_status === 'PAYMENT_PENDING').length, color: '#D4A843' },
                { label: 'Rejected', value: workshopRegs.filter(r => r.payment_status === 'REJECTED').length, color: '#C25B4A' },
              ].map((s) => (
                <div key={s.label} className="bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[11px] text-[#8A7968] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Session Settings */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 shadow-sm">
              <h2 className="font-display text-xl font-semibold text-[#604734] mb-4 flex items-center gap-2">
                <CalendarDays size={18} className="text-[#A96845]" /> Session Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#604734] mb-1">Saturday Date</label>
                  <input type="text" value={wsSettings.saturday_date}
                    onChange={e => setWsSettings(s => ({ ...s, saturday_date: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-[#604734] focus:outline-none focus:border-[#A96845] text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#604734] mb-1">Saturday Time</label>
                  <input type="text" value={wsSettings.saturday_time}
                    onChange={e => setWsSettings(s => ({ ...s, saturday_time: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-[#604734] focus:outline-none focus:border-[#A96845] text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#604734] mb-1">Max Seats (Sat)</label>
                  <input type="number" value={wsSettings.max_seats_saturday}
                    onChange={e => setWsSettings(s => ({ ...s, max_seats_saturday: parseInt(e.target.value) || 20 }))}
                    className="w-full p-2.5 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-[#604734] focus:outline-none focus:border-[#A96845] text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#604734] mb-1">Sunday Date</label>
                  <input type="text" value={wsSettings.sunday_date}
                    onChange={e => setWsSettings(s => ({ ...s, sunday_date: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-[#604734] focus:outline-none focus:border-[#A96845] text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#604734] mb-1">Sunday Time</label>
                  <input type="text" value={wsSettings.sunday_time}
                    onChange={e => setWsSettings(s => ({ ...s, sunday_time: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-[#604734] focus:outline-none focus:border-[#A96845] text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#604734] mb-1">Max Seats (Sun)</label>
                  <input type="number" value={wsSettings.max_seats_sunday}
                    onChange={e => setWsSettings(s => ({ ...s, max_seats_sunday: parseInt(e.target.value) || 20 }))}
                    className="w-full p-2.5 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-[#604734] focus:outline-none focus:border-[#A96845] text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#604734] mb-1">Workshop Fee (₹)</label>
                  <input type="number" value={wsSettings.fee}
                    onChange={e => setWsSettings(s => ({ ...s, fee: parseInt(e.target.value) || 1299 }))}
                    className="w-full p-2.5 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-[#604734] focus:outline-none focus:border-[#A96845] text-xs" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={wsSettings.registration_open}
                      onChange={e => setWsSettings(s => ({ ...s, registration_open: e.target.checked }))}
                      className="accent-[#A96845] w-4 h-4" />
                    <span className="text-xs font-medium text-[#604734]">Registration Open</span>
                  </label>
                </div>
              </div>
              <button onClick={handleSaveWsSettings} disabled={wsSaving}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: '#A96845' }}>
                {wsSaving ? 'Saving…' : 'Save Settings'}
              </button>
            </div>

            {/* Registrations Table */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DCCB] pb-4 mb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#604734]">All Registrations</h2>
                  <p className="text-xs text-[#8A7968] mt-0.5">Verify payments after checking your bank account</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={loadWorkshopRegs} className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-[#E8DCCB] text-[#604734] hover:bg-[#FBF3E7]">
                    <RefreshCw size={12} /> Refresh
                  </button>
                  <button onClick={exportWorkshopCSV} className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-[#E8DCCB] text-[#604734] hover:bg-[#FBF3E7]">
                    <Download size={12} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7968]" />
                  <input type="text" value={wsSearch} onChange={e => setWsSearch(e.target.value)}
                    placeholder="Search name, mobile, reg ID…"
                    className="pl-8 pr-4 py-2 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-xs text-[#604734] focus:outline-none focus:border-[#A96845] w-56" />
                </div>
                <select value={wsStatusFilter} onChange={e => setWsStatusFilter(e.target.value as typeof wsStatusFilter)}
                  className="px-3 py-2 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-xs text-[#604734] focus:outline-none focus:border-[#A96845] cursor-pointer">
                  <option value="ALL">All Statuses</option>
                  <option value="PAYMENT_PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <select value={wsSessionFilter} onChange={e => setWsSessionFilter(e.target.value as typeof wsSessionFilter)}
                  className="px-3 py-2 rounded-xl border border-[#E8DCCB] bg-[#FAF3E8] text-xs text-[#604734] focus:outline-none focus:border-[#A96845] cursor-pointer">
                  <option value="ALL">All Sessions</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>

              {workshopLoading ? (
                <div className="text-center py-12 text-[#8A7968] text-xs">Loading registrations…</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E8DCCB] text-[11px] uppercase tracking-wider text-[#8A7968] font-semibold">
                        <th className="py-3 px-2">Reg ID</th>
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Mobile</th>
                        <th className="py-3 px-2">Session</th>
                        <th className="py-3 px-2">Crafts</th>
                        <th className="py-3 px-2">UTR / Screenshot</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Date</th>
                        <th className="py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCCB]/60">
                      {workshopRegs
                        .filter(r => {
                          const q = wsSearch.toLowerCase();
                          const matchSearch = !q || r.full_name.toLowerCase().includes(q) || r.mobile.includes(q) || r.registration_id.toLowerCase().includes(q);
                          const matchStatus = wsStatusFilter === 'ALL' || r.payment_status === wsStatusFilter;
                          const matchSession = wsSessionFilter === 'ALL' || r.session === wsSessionFilter;
                          return matchSearch && matchStatus && matchSession;
                        })
                        .map((reg) => (
                          <tr key={reg.id} className="hover:bg-[#FAF3E8]/50 transition-colors">
                            <td className="py-3 px-2 font-mono font-bold text-[#A96845] text-[10px]">{reg.registration_id}</td>
                            <td className="py-3 px-2 font-medium text-[#604734]">
                              <div>{reg.full_name}</div>
                              <div className="text-[10px] text-[#8A7968]">{reg.email ?? ''}</div>
                            </td>
                            <td className="py-3 px-2 text-[#604734]">
                              <div>{reg.mobile}</div>
                              <div className="text-[10px] text-[#8A7968]">WA: {reg.whatsapp}</div>
                            </td>
                            <td className="py-3 px-2">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{ background: reg.session === 'saturday' ? '#D8C4A8' : '#E9D9C4', color: '#594333' }}>
                                {reg.session === 'saturday' ? 'Sat' : 'Sun'}
                              </span>
                              <div className="text-[10px] text-[#8A7968] mt-0.5">{reg.age_group}</div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex flex-wrap gap-1">
                                {reg.craft_interests.map(c => (
                                  <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#D8C4A8', color: '#594333' }}>{c}</span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              {reg.utr ? (
                                <div>
                                  <div className="font-mono text-[10px] text-[#604734]">{reg.utr}</div>
                                  {reg.screenshot_url && (
                                    <a href={reg.screenshot_url} target="_blank" rel="noopener noreferrer"
                                      className="text-[10px] text-[#A96845] hover:underline flex items-center gap-0.5 mt-0.5">
                                      <Eye size={10} /> View Screenshot
                                    </a>
                                  )}
                                </div>
                              ) : <span className="text-[10px] text-[#8A7968] italic">Not submitted</span>}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                reg.payment_status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                                reg.payment_status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {reg.payment_status === 'PAYMENT_PENDING' ? 'PENDING' : reg.payment_status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-[10px] text-[#8A7968]">
                              {new Date(reg.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-3 px-2">
                              {reg.payment_status === 'PAYMENT_PENDING' && reg.utr && (
                                <div className="flex flex-col gap-1">
                                  <input
                                    type="text"
                                    value={wsAdminNote[reg.id] ?? reg.admin_notes ?? ''}
                                    onChange={e => setWsAdminNote(n => ({ ...n, [reg.id]: e.target.value }))}
                                    placeholder="Admin note…"
                                    className="w-28 p-1.5 rounded-lg border border-[#E8DCCB] bg-[#FAF3E8] text-[10px] text-[#604734] focus:outline-none" />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleVerifyPayment(reg, 'CONFIRMED')}
                                      disabled={wsActionLoading === reg.id}
                                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white transition-all hover:opacity-80 disabled:opacity-50"
                                      style={{ background: '#6B8E6B' }}>
                                      <CheckCheck size={10} /> Confirm
                                    </button>
                                    <button
                                      onClick={() => handleVerifyPayment(reg, 'REJECTED')}
                                      disabled={wsActionLoading === reg.id}
                                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white transition-all hover:opacity-80 disabled:opacity-50"
                                      style={{ background: '#C25B4A' }}>
                                      <XCircle size={10} /> Reject
                                    </button>
                                  </div>
                                </div>
                              )}
                              {reg.payment_status !== 'PAYMENT_PENDING' && (
                                <span className="text-[10px] text-[#8A7968] italic">
                                  {reg.verified_at ? new Date(reg.verified_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {workshopRegs.length === 0 && !workshopLoading && (
                    <div className="text-center py-12 text-[#8A7968] text-xs">No registrations yet. Share the workshop page!</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 1: ADD PRODUCT                                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'product' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 sm:p-8 shadow-sm">
              <div className="border-b border-[#E8DCCB] pb-4 mb-6">
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#604734]">
                  Create New Handmade Product
                </h2>
                <p className="text-xs text-[#8A7968] mt-1">
                  Fill in the details below. The product will instantly appear in the shop.
                </p>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-5 text-xs">
                {/* Product Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Daisy Flower Crochet Sling Bag"
                    className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                  />
                </div>

                {/* Category & Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="1499"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Compare Price (₹)
                    </label>
                    <input
                      type="number"
                      value={productForm.comparePrice}
                      onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                      placeholder="1999"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>
                </div>

                {/* Material & Craft Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Yarn Material
                    </label>
                    <input
                      type="text"
                      value={productForm.material}
                      onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                      placeholder="100% Cotton Yarn"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Crafting Time
                    </label>
                    <input
                      type="text"
                      value={productForm.craftTime}
                      onChange={(e) => setProductForm({ ...productForm, craftTime: e.target.value })}
                      placeholder="e.g. 8 Hours"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Available Stock
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="15"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>
                </div>

                {/* Color Variants */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                    Color Variants (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    placeholder="Terracotta, Natural Cream, Sage Green"
                    className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                  />
                </div>

                {/* Image Selection / Presets */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                    Product Image (Choose a Preset or Enter Custom Image URL)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                    {PRESET_PRODUCT_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, imageUrl: img.url })}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                          productForm.imageUrl === img.url
                            ? 'border-[#B96F48] ring-2 ring-[#B96F48]/40 scale-105'
                            : 'border-[#E8DCCB] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <Image src={img.url} alt={img.label} fill className="object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] p-0.5 truncate text-center">
                          {img.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/photo.jpg or /images/product-bag.jpg"
                    className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs font-mono"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                    Artisan Story &amp; Description
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe how your mom hand-wove this item, the stitches used, care instructions, and what makes it special..."
                    className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs resize-none"
                  />
                </div>

                {/* Badges Toggle */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="accent-[#B96F48] rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-[#604734]">Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isBestSeller}
                      onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                      className="accent-[#B96F48] rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-[#604734]">Mark as Best Seller</span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#B96F48] hover:bg-[#9E5B37] text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Publishing...'
                  ) : (
                    <>
                      <Plus size={16} /> Publish Product to Store
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-5 bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 shadow-sm sticky top-28">
              <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3 mb-4">
                <span className="text-xs font-semibold text-[#604734] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#B96F48]" /> Live Store Preview
                </span>
                <span className="text-[10px] bg-[#E9D9C4]/40 text-[#B96F48] font-semibold px-2 py-0.5 rounded-full">
                  Customer View
                </span>
              </div>

              {/* Product Card Preview */}
              <div className="bg-[#FBF3E7] rounded-2xl border border-[#E8DCCB] overflow-hidden p-4">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3">
                  <Image
                    src={productForm.imageUrl || '/images/product-bag.jpg'}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  {productForm.isBestSeller && (
                    <span className="absolute top-2.5 left-2.5 bg-[#B96F48] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Best Seller
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7968] uppercase tracking-wider font-semibold">
                    {categories.find((c) => c.slug === productForm.category)?.name || 'Crochet Bags'}
                  </span>
                  <h3 className="font-display text-base font-semibold text-[#604734] line-clamp-1">
                    {productForm.name || 'Your Handcrafted Creation'}
                  </h3>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm font-bold text-[#B96F48]">
                      ₹{productForm.price ? parseInt(productForm.price).toLocaleString('en-IN') : '1,499'}
                    </span>
                    {productForm.comparePrice && (
                      <span className="text-xs text-[#8A7968] line-through">
                        ₹{parseInt(productForm.comparePrice).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#8A7968] line-clamp-2 pt-1">
                    {productForm.description ||
                      `Crafted with ${productForm.material}. Takes ~${productForm.craftTime} to make by hand.`}
                  </p>

                  <div className="pt-3 border-t border-[#E8DCCB] flex items-center justify-between text-[10px] text-[#8A7968]">
                    <span>Stock: {productForm.stock || '15'} in studio</span>
                    <span>✧ Hand-crocheted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 2: ADD MASTERCLASS / COURSE                                 */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'course' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 sm:p-8 shadow-sm">
              <div className="border-b border-[#E8DCCB] pb-4 mb-6">
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#604734]">
                  Publish New Crochet Masterclass
                </h2>
                <p className="text-xs text-[#8A7968] mt-1">
                  Offer step-by-step video lessons and teach others the art of crochet.
                </p>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-5 text-xs">
                {/* Course Title */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g. Masterclass: Classic Granny Squares to Modern Bags"
                    className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                  />
                </div>

                {/* Instructor & Skill Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={courseForm.instructor}
                      onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                      placeholder="Mom · Master Crochet Artisan"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Skill Level
                    </label>
                    <select
                      value={courseForm.level}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })
                      }
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs cursor-pointer"
                    >
                      <option value="Beginner">Beginner (Zero Experience Needed)</option>
                      <option value="Intermediate">Intermediate (Stitch Combinations)</option>
                      <option value="Advanced">Advanced (Complex 3D Amigurumi)</option>
                    </select>
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Enrollment Fee (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                      placeholder="999"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Total Duration
                    </label>
                    <input
                      type="text"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      placeholder="e.g. 4.5 Hours"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                      Number of Lessons
                    </label>
                    <input
                      type="number"
                      value={courseForm.lessonCount}
                      onChange={(e) => setCourseForm({ ...courseForm, lessonCount: e.target.value })}
                      placeholder="12"
                      className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs"
                    />
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                    Course Trailer / Stream URL (YouTube, Vimeo, or Cloudinary)
                  </label>
                  <input
                    type="text"
                    value={courseForm.videoUrl}
                    onChange={(e) => setCourseForm({ ...courseForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs font-mono"
                  />
                </div>

                {/* Course Banner Image */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                    Course Cover Image
                  </label>
                  <input
                    type="text"
                    value={courseForm.imageUrl}
                    onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
                    placeholder="/images/hero-banner.jpg"
                    className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs font-mono"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#604734] uppercase tracking-wider mb-1.5">
                    Course Syllabus &amp; Overview
                  </label>
                  <textarea
                    rows={3}
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="Detail what students will make, what materials are included, and the skills covered in this masterclass..."
                    className="w-full p-3 rounded-xl border border-[#E8DCCB] bg-[#FBF3E7] text-[#604734] focus:outline-none focus:border-[#B96F48] text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#B96F48] hover:bg-[#9E5B37] text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Publishing Masterclass...'
                  ) : (
                    <>
                      <GraduationCap size={16} /> Publish Masterclass Course
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Course Card Preview */}
            <div className="lg:col-span-5 bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 shadow-sm sticky top-28">
              <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3 mb-4">
                <span className="text-xs font-semibold text-[#604734] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#B96F48]" /> Course Preview
                </span>
                <span className="text-[10px] bg-[#E9D9C4]/40 text-[#B96F48] font-semibold px-2 py-0.5 rounded-full">
                  LMS Student Portal
                </span>
              </div>

              <div className="bg-[#FBF3E7] rounded-2xl border border-[#E8DCCB] overflow-hidden">
                <div className="relative aspect-video w-full">
                  <Image
                    src={courseForm.imageUrl || '/images/hero-banner.jpg'}
                    alt="Course Preview"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#FFFDF9]/95 backdrop-blur-sm text-[#604734] text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {courseForm.level}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[11px] text-[#8A7968]">Mentor: {courseForm.instructor}</span>
                  <h3 className="font-display text-base font-semibold text-[#604734] line-clamp-1">
                    {courseForm.title || 'Masterclass: Modern Crochet Design'}
                  </h3>

                  <div className="flex items-center gap-4 text-[11px] text-[#8A7968]">
                    <span>⏱ {courseForm.duration}</span>
                    <span>•</span>
                    <span>📚 {courseForm.lessonCount} Lessons</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#E8DCCB]">
                    <span className="text-base font-bold text-[#B96F48]">
                      ₹{courseForm.price ? parseInt(courseForm.price).toLocaleString('en-IN') : '999'}
                    </span>
                    <span className="text-[11px] bg-[#B96F48] text-white px-3 py-1 rounded-lg font-medium">
                      Enroll Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 3: INVENTORY & CATALOG OVERVIEW                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            {/* Products List */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-4 mb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#604734]">
                    Active Products in Shop ({productList.length})
                  </h2>
                  <p className="text-xs text-[#8A7968] mt-0.5">
                    Mom&apos;s current catalog live on Loop &amp; Loom
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('product')}
                  className="bg-[#B96F48] text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-[#9E5B37] flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              <div className="divide-y divide-[#E8DCCB]/60 max-h-[480px] overflow-y-auto">
                {productList.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E8DCCB] flex-shrink-0 bg-[#FBF3E7]">
                        <Image src={item.images[0] || '/images/product-bag.jpg'} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#604734] line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#8A7968] mt-0.5">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">Stock: {item.stock}</span>
                          <span>•</span>
                          <span>{item.material || 'Cotton Yarn'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-[#B96F48]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <Link
                        href={`/product/${item.slug}`}
                        target="_blank"
                        className="text-xs text-[#8A7968] hover:text-[#B96F48] p-1.5"
                        title="View Live Page"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.name}" from catalog?`)) {
                            setProductList((prev) => prev.filter((p) => p.id !== item.id));
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 p-1.5"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses List */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-4 mb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#604734]">
                    Masterclasses &amp; Video Courses ({courseList.length})
                  </h2>
                  <p className="text-xs text-[#8A7968] mt-0.5">
                    Mom&apos;s published tutorials and guided learning series
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('course')}
                  className="bg-[#B96F48] text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-[#9E5B37] flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Masterclass
                </button>
              </div>

              <div className="divide-y divide-[#E8DCCB]/60">
                {courseList.map((c) => (
                  <div key={c.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E8DCCB] flex-shrink-0 bg-[#FBF3E7]">
                        <Image src={c.image || '/images/hero-banner.jpg'} alt={c.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#604734] line-clamp-1">{c.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#8A7968] mt-0.5">
                          <span>{c.level}</span>
                          <span>•</span>
                          <span>{c.duration}</span>
                          <span>•</span>
                          <span>{c.lessonCount} Lessons</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-[#B96F48]">
                        ₹{c.price.toLocaleString('en-IN')}
                      </span>
                      <Link
                        href={`/courses/${c.slug}`}
                        target="_blank"
                        className="text-xs text-[#8A7968] hover:text-[#B96F48] p-1.5"
                        title="View Course Page"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${c.title}"?`)) {
                            setCourseList((prev) => prev.filter((item) => item.id !== c.id));
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 p-1.5"
                        title="Delete course"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 4: USERS & CUSTOMERS DIRECTORY                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Context Card */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DCCB] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DCCB] pb-4 mb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#604734]">
                    User Accounts &amp; Permissions Directory
                  </h2>
                  <p className="text-xs text-[#8A7968] mt-0.5">
                    View customer phone numbers, delivery addresses, and assign Admin rights to Mom or team members.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7968]" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or UID..."
                    className="w-full pl-9 pr-4 py-2 bg-[#FBF3E7] border border-[#E8DCCB] rounded-xl text-xs text-[#604734] focus:outline-none focus:border-[#B96F48]"
                  />
                </div>
              </div>

              {/* Explanatory Info Card */}
              <div className="bg-[#FBF3E7]/80 rounded-xl p-4 border border-[#E8DCCB] mb-6 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#B96F48] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#604734] leading-relaxed">
                  <strong className="font-semibold text-[#604734]">Supabase Column Note:</strong> In Supabase, the built-in <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono border border-[#E8DCCB]">auth.users</code> screen is strictly for password credentials. All customer fields (<strong className="text-[#B96F48]">Phone Number, Delivery Address, Full Name, and Role</strong>) are stored in the <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono border border-[#E8DCCB]">profiles</code> table and displayed here live.
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E8DCCB] text-[11px] uppercase tracking-wider text-[#8A7968] font-semibold">
                      <th className="py-3 px-3">UID (User ID)</th>
                      <th className="py-3 px-3">Full Name</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Phone Number</th>
                      <th className="py-3 px-3">Delivery Address</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3 text-right">Admin Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCCB]/60">
                    {usersList
                      .filter(
                        (u) =>
                          u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.id.toLowerCase().includes(userSearchQuery.toLowerCase())
                      )
                      .map((u) => {
                        const isUserAdmin = u.role === 'admin';
                        return (
                          <tr key={u.id} className="hover:bg-[#FBF3E7]/50 transition-colors">
                            {/* UID */}
                            <td className="py-3.5 px-3 font-mono text-[10px] text-[#8A7968]">
                              <span title={u.id}>
                                {u.id.length > 18 ? `${u.id.slice(0, 8)}...${u.id.slice(-6)}` : u.id}
                              </span>
                            </td>

                            {/* Name */}
                            <td className="py-3.5 px-3 font-medium text-[#604734]">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#B96F48] text-white flex items-center justify-center text-[10px] font-bold">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{u.name}</span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-3.5 px-3 text-[#604734] font-medium">{u.email}</td>

                            {/* Phone */}
                            <td className="py-3.5 px-3 text-[#604734]">
                              {u.phone || <span className="text-[#8A7968] italic">Not provided</span>}
                            </td>

                            {/* Address */}
                            <td className="py-3.5 px-3 text-[#8A7968] max-w-[200px] truncate" title={u.address}>
                              {u.address || <span className="text-[#8A7968] italic">Not provided</span>}
                            </td>

                            {/* Role Badge */}
                            <td className="py-3.5 px-3">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  isUserAdmin
                                    ? 'bg-[#B96F48]/15 text-[#B96F48] border border-[#B96F48]/30 font-bold'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {isUserAdmin && <Sparkles size={10} />}
                                {u.role}
                              </span>
                            </td>

                            {/* Action: Toggle Admin */}
                            <td className="py-3.5 px-3 text-right">
                              <button
                                onClick={async () => {
                                  const newRole = isUserAdmin ? 'customer' : 'admin';
                                  // Update local state
                                  setUsersList((prev) =>
                                    prev.map((item) => (item.id === u.id ? { ...item, role: newRole } : item))
                                  );

                                  // Update logged-in user if modifying self
                                  if (user && user.id === u.id) {
                                    setRole(newRole);
                                  }

                                  // Update Supabase
                                  try {
                                    await supabase.from('profiles').update({ role: newRole }).eq('id', u.id);
                                  } catch {
                                    // non-blocking
                                  }

                                  showNotification(
                                    `Role Updated! ✦`,
                                    `${u.name} is now an ${newRole.toUpperCase()}`,
                                    'admin'
                                  );
                                }}
                                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                  isUserAdmin
                                    ? 'border border-[#E8DCCB] text-[#8A7968] hover:text-red-600 hover:border-red-300'
                                    : 'bg-[#B96F48] text-white hover:bg-[#9E5B37] shadow-sm'
                                }`}
                              >
                                {isUserAdmin ? 'Demote to Customer' : 'Promote to Admin ✦'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
