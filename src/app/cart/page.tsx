'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  Truck,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const subtotal = getSubtotal();
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shipping = isFreeShipping ? 0 : 99;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'WELCOME10') {
      setDiscountPercent(10);
      setCouponApplied('WELCOME10 (10% off)');
      setCouponCode('');
    } else if (code === 'HANDMADE15') {
      setDiscountPercent(15);
      setCouponApplied('HANDMADE15 (15% off)');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or HANDMADE15');
    }
  };

  const removeCoupon = () => {
    setDiscountPercent(0);
    setCouponApplied('');
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[75vh] flex items-center justify-center bg-bg px-4">
        <div className="max-w-md w-full text-center bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="w-20 h-20 bg-bg-alt/30 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-display text-3xl text-text mb-2">Your Basket is Empty</h1>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Looks like you haven&apos;t added any handmade treasures to your basket yet. Explore our handcrafted collections or beginner crochet courses!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="flex-1 bg-accent text-card text-sm font-medium py-3 px-6 rounded-xl hover:bg-accent/90 transition-all text-center"
            >
              Explore Shop
            </Link>
            <Link
              href="/courses"
              className="flex-1 border border-border text-text text-sm font-medium py-3 px-6 rounded-xl hover:bg-bg transition-all text-center"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted flex items-center gap-2 mb-6">
          <Link href="/" className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-text transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-text font-medium">Cart</span>
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl text-text mb-2">Shopping Basket</h1>
        <p className="text-xs text-muted mb-8">
          Review your chosen artisanal creations before moving forward to checkout.
        </p>

        {/* Free shipping goal bar */}
        <div className="mb-8 p-4 bg-card rounded-2xl border border-border">
          {subtotal < freeShippingThreshold ? (
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-text font-medium flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-accent" />
                  Add ₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more to unlock <strong className="text-accent">FREE Shipping</strong>!
                </span>
                <span className="text-muted">{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
              </div>
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                <div
                  className="bg-accent h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              You qualify for FREE Standard Delivery across India!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-bg border border-border flex-shrink-0">
                    <Image
                      src={item.product.images[0] || '/images/hero-banner.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-display text-lg text-text hover:text-accent transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-muted space-x-2 mt-0.5">
                      {item.selectedColor && <span>Color: <strong className="text-text">{item.selectedColor}</strong></span>}
                      {item.selectedSize && <span>Size: <strong className="text-text">{item.selectedSize}</strong></span>}
                    </div>
                    <div className="text-xs font-semibold text-accent mt-2 sm:hidden">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-border rounded-xl bg-bg">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 text-muted hover:text-text transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-text min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 text-muted hover:text-text transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right hidden sm:block min-w-[80px]">
                    <div className="text-sm font-semibold text-accent">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-muted">
                        ₹{item.product.price.toLocaleString('en-IN')} each
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-muted hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Note & Action row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                href="/shop"
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                ← Continue Browsing Boutique
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-muted hover:text-red-600 transition-colors"
              >
                Clear entire basket
              </button>
            </div>

            {/* Special Instructions or Gift Note */}
            <div className="p-4 bg-card rounded-2xl border border-border mt-6">
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                Order Notes &amp; Gift Message (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Include a handwritten note, custom delivery instructions, or gift wrap requests..."
                className="w-full text-xs p-3 rounded-xl border border-border bg-bg focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h2 className="font-display text-2xl text-text border-b border-border pb-4">
              Order Summary
            </h2>

            {/* Promo Code */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon (e.g. WELCOME10)"
                  className="flex-1 text-xs px-3 py-2 border border-border rounded-xl bg-bg focus:outline-none focus:border-accent uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-text text-card text-xs font-semibold rounded-xl hover:bg-text/90 transition-all"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
              {couponApplied && (
                <div className="flex items-center justify-between mt-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" /> {couponApplied}
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[10px] underline hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Line items */}
            <div className="space-y-3 text-xs text-muted border-b border-border pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-text font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-text font-medium">
                  {shipping === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes &amp; GST</span>
                <span className="text-text font-medium">Included</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-base font-semibold text-text">Total</span>
                <p className="text-[10px] text-muted">All taxes included</p>
              </div>
              <span className="text-2xl font-display font-semibold text-accent">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Proceed to checkout button */}
            <button
              type="button"
              onClick={() => router.push('/checkout')}
              className="w-full bg-accent text-card font-medium py-3.5 px-6 rounded-xl hover:bg-accent/90 transition-all shadow-sm flex items-center justify-center gap-2 group text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-muted pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe &amp; Encrypted Razorpay Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
