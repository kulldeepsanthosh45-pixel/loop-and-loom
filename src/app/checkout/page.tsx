'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  Truck, 
  QrCode,
  Wallet
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { showNotification } from '@/lib/notification-store';

// Zod schema for address validation
const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  addressLine1: z.string().min(5, 'Street address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit postal pincode'),
  deliveryNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone?.replace(/\D/g, '').slice(-10) || '',
    addressLine1: user?.address || '',
    addressLine2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    deliveryNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsProcessing(true);

    // Simulate Razorpay checkout integration
    setTimeout(() => {
      const newOrderId = 'LL-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newOrderId);
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
      showNotification('Order Confirmed! 🎉', `Order #${newOrderId} placed successfully · Delivery in 4-6 days`, 'order');
    }, 1800);
  };

  if (orderComplete) {
    return (
      <div className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center bg-bg px-4">
        <div className="max-w-lg w-full bg-card border border-border rounded-3xl p-8 sm:p-10 text-center shadow-lg animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">
            Order Confirmed
          </span>
          <h1 className="font-display text-3xl text-text mt-1 mb-2">Thank You for Your Order!</h1>
          <p className="text-xs text-muted leading-relaxed mb-6">
            We have received your order <strong className="text-text font-mono">#{orderId}</strong>. A confirmation email with receipt and tracking details has been sent to <strong className="text-text">{formData.email}</strong>.
          </p>

          <div className="bg-bg rounded-2xl p-4 text-left border border-border text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-muted">Estimated Delivery:</span>
              <span className="font-semibold text-text">4 - 6 Business Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Payment Status:</span>
              <span className="font-semibold text-emerald-700">Verified via Razorpay (INR)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Ship To:</span>
              <span className="text-text truncate max-w-[220px]">{formData.fullName}, {formData.city}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="flex-1 bg-accent text-card text-xs font-semibold py-3 px-4 rounded-xl hover:bg-accent/90 transition-all text-center"
            >
              View Order in Dashboard
            </Link>
            <Link
              href="/shop"
              className="flex-1 border border-border text-text text-xs font-semibold py-3 px-4 rounded-xl hover:bg-bg transition-all text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center bg-bg px-4">
        <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8">
          <h2 className="font-display text-2xl text-text mb-2">No Items to Checkout</h2>
          <p className="text-xs text-muted mb-6">Your shopping basket is currently empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-accent text-card text-xs font-semibold py-2.5 px-6 rounded-xl hover:bg-accent/90"
          >
            Explore the Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/cart" className="text-xs text-muted hover:text-text flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-text mb-2">Express Checkout</h1>
        <p className="text-xs text-muted mb-8 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-accent" /> Safe and 256-bit SSL encrypted checkout
        </p>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Address & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* Shipping Address Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">1</span>
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Radhika Sharma"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-bg focus:outline-none ${
                        errors.fullName ? 'border-red-500' : 'border-border focus:border-accent'
                      }`}
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="radhika@example.com"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-bg focus:outline-none ${
                          errors.email ? 'border-red-500' : 'border-border focus:border-accent'
                        }`}
                      />
                      {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                        Phone (for Delivery SMS) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-bg focus:outline-none ${
                          errors.phone ? 'border-red-500' : 'border-border focus:border-accent'
                        }`}
                      />
                      {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                      Street Address / Flat / Floor *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Flat 302, Green Glen Apartments, 4th Cross"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-bg focus:outline-none ${
                        errors.addressLine1 ? 'border-red-500' : 'border-border focus:border-accent'
                      }`}
                    />
                    {errors.addressLine1 && <p className="text-[10px] text-red-500 mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                      Landmark or Apartment Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Near Lotus Pond"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-bg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-bg focus:outline-none ${
                          errors.city ? 'border-red-500' : 'border-border focus:border-accent'
                        }`}
                      />
                      {errors.city && <p className="text-[10px] text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-bg focus:outline-none ${
                          errors.state ? 'border-red-500' : 'border-border focus:border-accent'
                        }`}
                      />
                      {errors.state && <p className="text-[10px] text-red-500 mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-bg focus:outline-none ${
                          errors.pincode ? 'border-red-500' : 'border-border focus:border-accent'
                        }`}
                      />
                      {errors.pincode && <p className="text-[10px] text-red-500 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">2</span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-border hover:border-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="text-accent accent-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-accent" /> Razorpay (Cards, Netbanking, Wallets)
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                          Instant Confirmation
                        </span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        Accepts Visa, Mastercard, RuPay, Amex &amp; all major Indian banks.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-border hover:border-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-accent accent-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-accent" /> UPI (Google Pay, PhonePe, Paytm, BHIM)
                        </span>
                        <span className="text-[10px] text-muted">0% Fee</span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        Pay effortlessly using your UPI ID or QR scan.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-border hover:border-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-accent accent-accent"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-text flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-accent" /> Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-muted mt-0.5">
                        Pay in cash upon doorstep delivery.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6 sticky top-28">
              <h2 className="font-display text-2xl text-text border-b border-border pb-3">
                Items in Order ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>

              <div className="divide-y divide-border max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}`} className="py-3 flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg border border-border flex-shrink-0">
                      <Image
                        src={item.product.images[0] || '/images/hero-banner.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-text truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-muted">
                        Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-accent">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-muted border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-text font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="text-text font-medium">
                    {shipping === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% included)</span>
                  <span className="text-text font-medium">₹{Math.round((subtotal * 0.18) / 1.18).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline border-t border-border pt-4">
                <span className="text-sm font-semibold text-text">Total Payable</span>
                <span className="text-2xl font-display font-semibold text-accent">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-accent text-card font-medium py-3.5 px-6 rounded-xl hover:bg-accent/90 transition-all shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-card border-t-transparent rounded-full animate-spin" />
                    Connecting to Razorpay...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Pay ₹{total.toLocaleString('en-IN')} Now
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[10px] text-muted flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Transactions are secured by Razorpay Payments India
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
