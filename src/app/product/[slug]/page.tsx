'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Minus, 
  Plus, 
  Check, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { products } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    colorPreference: '',
    customNotes: '',
  });

  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor || undefined, selectedSize || undefined);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedColor || undefined, selectedSize || undefined);
    router.push('/checkout');
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySent(true);
    setTimeout(() => {
      setShowEnquiryModal(false);
      setEnquirySent(false);
    }, 2500);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  // If not enough same-category items, pad with other products
  const displayRelated = relatedProducts.length > 0 
    ? relatedProducts 
    : products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-text transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-text transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-text font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
              <Image
                src={product.images[selectedImage] || product.images[0] || '/images/hero-banner.jpg'}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-accent text-card text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  New Arrival
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === idx
                        ? 'border-accent shadow-sm scale-105'
                        : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Add to wishlist"
                  className={`p-2 rounded-full border transition-colors ${
                    isWishlisted
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted hover:text-text hover:border-text'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Product link copied to clipboard!');
                  }}
                  aria-label="Share product"
                  className="p-2 rounded-full border border-border text-muted hover:text-text hover:border-text transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl text-text mt-2 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-500'
                        : i < product.rating
                        ? 'fill-amber-500 opacity-50'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-text">{product.rating}</span>
              <span className="text-xs text-muted">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
              <span className="text-3xl font-display font-semibold text-accent">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-muted line-through">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.comparePrice && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="text-muted text-sm leading-relaxed mb-6 font-body">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text">
                    Color: <span className="font-normal text-muted">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedColor === color
                          ? 'border-accent bg-accent text-card shadow-sm'
                          : 'border-border bg-card text-text hover:border-muted'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text">
                    Size: <span className="font-normal text-muted">{selectedSize}</span>
                  </span>
                </div>
                <div className="flex gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-card shadow-sm'
                          : 'border-border bg-card text-text hover:border-muted'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A96845] animate-pulse" />
              <span className="text-xs font-semibold text-[#A96845] bg-[#A96845]/10 px-3 py-1 rounded-full">
                ✦ Coming Soon — New Batch In Crafting
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                type="button"
                disabled
                className="flex-1 bg-[#D8C4A8] text-[#594333] font-semibold py-3.5 px-6 rounded-xl cursor-not-allowed opacity-80 flex items-center justify-center gap-2"
              >
                <span>Stock Coming Soon ✦</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEnquiryModal(true)}
                className="flex-1 border-2 border-[#A96845] text-[#A96845] font-semibold py-3.5 px-6 rounded-xl hover:bg-[#A96845] hover:text-white transition-all flex items-center justify-center gap-2 text-xs"
              >
                <span>Notify Me / Custom Enquiry</span>
              </button>
            </div>

            {/* Custom Order Enquiry CTA */}
            <div className="p-4 rounded-xl bg-bg-alt/25 border border-border/80 mb-6 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" /> Custom Color or Size?
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Request custom dimensions, colour palettes or monogramming.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEnquiryModal(true)}
                className="text-xs font-medium text-accent border border-accent/40 bg-card px-3 py-1.5 rounded-lg hover:bg-accent hover:text-card transition-all"
              >
                Custom Enquiry
              </button>
            </div>

            {/* Assurance badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-card border border-border">
                <Truck className="w-4 h-4 text-accent mb-1.5" />
                <span className="text-[11px] font-semibold text-text">Pan-India Ship</span>
                <span className="text-[10px] text-muted">Free above ₹999</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-card border border-border">
                <ShieldCheck className="w-4 h-4 text-accent mb-1.5" />
                <span className="text-[11px] font-semibold text-text">100% Handmade</span>
                <span className="text-[10px] text-muted">Azo-free yarn</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-card border border-border">
                <RefreshCw className="w-4 h-4 text-accent mb-1.5" />
                <span className="text-[11px] font-semibold text-text">Easy Returns</span>
                <span className="text-[10px] text-muted">7 days replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Details */}
        <div className="mt-16 bg-card rounded-2xl border border-border p-6 sm:p-8">
          <div className="flex gap-8 border-b border-border pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`text-sm font-semibold tracking-wide uppercase pb-2 border-b-2 transition-all ${
                activeTab === 'details'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              Product Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('care')}
              className={`text-sm font-semibold tracking-wide uppercase pb-2 border-b-2 transition-all ${
                activeTab === 'care'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              Care & Material
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-semibold tracking-wide uppercase pb-2 border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'details' && (
              <div className="prose prose-sm text-text max-w-none space-y-4">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold">Material</span>
                    <p className="text-sm font-medium mt-1">{product.material || 'Premium Soft Cotton Yarn'}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold">Technique</span>
                    <p className="text-sm font-medium mt-1">100% Hand Crocheted by Artisan Women</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold">Country of Origin</span>
                    <p className="text-sm font-medium mt-1">Handcrafted in India</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold">Batch Status</span>
                    <p className="text-sm font-medium mt-1">Limited Micro-Batch Craft</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4 text-sm text-text">
                <h4 className="font-semibold text-text">How to care for your handmade crochet piece:</h4>
                <ul className="list-disc pl-5 space-y-2 text-muted">
                  <li>Gentle hand wash in cold water using mild detergent or baby shampoo.</li>
                  <li>Do not wring, twist, or bleach the item.</li>
                  <li>Press gently between dry towels to remove excess water.</li>
                  <li>Reshape and lay flat to dry in the shade; avoid direct harsh sunlight.</li>
                  <li>Store folded in a breathable cotton bag. Do not hang crochet bags by straps to prevent stretching.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-alt/20 border border-border">
                  <div className="text-center pr-4 border-r border-border">
                    <span className="text-3xl font-display font-bold text-accent">{product.rating}</span>
                    <p className="text-[11px] text-muted">out of 5</p>
                  </div>
                  <div>
                    <div className="flex items-center text-amber-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-muted">Verified buyer ratings from our community</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent/20 text-accent font-semibold flex items-center justify-center text-xs">
                          A
                        </div>
                        <span className="text-xs font-semibold text-text">Aditi S.</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Verified Buyer</span>
                      </div>
                      <span className="text-[10px] text-muted">3 weeks ago</span>
                    </div>
                    <div className="flex items-center text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      Absolutely enchanted with the stitch quality! The yarn is soft yet holds its shape firmly. You can clearly feel the dedication in each loop.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent/20 text-accent font-semibold flex items-center justify-center text-xs">
                          K
                        </div>
                        <span className="text-xs font-semibold text-text">Kavya N.</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Verified Buyer</span>
                      </div>
                      <span className="text-[10px] text-muted">1 month ago</span>
                    </div>
                    <div className="flex items-center text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      Ordered this as a gift for my sister and she was overjoyed. Arrived wrapped in thoughtful eco-friendly paper packaging with a handwritten thank-you note!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-text">You May Also Cherish</h2>
              <p className="text-xs text-muted mt-1">Handpicked complementary handmade creations</p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              Browse All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {displayRelated.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Order Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <h3 className="font-display text-2xl text-text mb-1">Custom Order Enquiry</h3>
            <p className="text-xs text-muted mb-4">
              Share your custom color palette or design modifications for <strong className="text-text">{product.name}</strong>.
            </p>

            {enquirySent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-text">Enquiry Received!</h4>
                <p className="text-xs text-muted">
                  Our artisan team will reach out via WhatsApp / Email within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={enquiryData.name}
                    onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:border-accent"
                    placeholder="e.g. Radhika Roy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryData.email}
                      onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:border-accent"
                      placeholder="name@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={enquiryData.phone}
                      onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:border-accent"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                    Preferred Colors / Yarn Choice
                  </label>
                  <input
                    type="text"
                    value={enquiryData.colorPreference}
                    onChange={(e) => setEnquiryData({ ...enquiryData, colorPreference: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:border-accent"
                    placeholder="e.g. Forest green base with mustard petals"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                    Custom Requests & Dimensions
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryData.customNotes}
                    onChange={(e) => setEnquiryData({ ...enquiryData, customNotes: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:border-accent"
                    placeholder="Provide any specific dimensions, strap length, or deadline requirements..."
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEnquiryModal(false)}
                    className="flex-1 py-2 text-xs font-medium border border-border rounded-lg text-muted hover:text-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-medium bg-accent text-card rounded-lg hover:bg-accent/90"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-20 text-center text-xs text-muted">Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
