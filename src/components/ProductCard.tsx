'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, getStockStatus } from '@/lib/utils';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const stockStatus = getStockStatus(product.stock);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.colors?.[0]);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#E8DCCB] hover:border-[#B96F48]/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(96,71,52,0.06)]">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#FBF3E7]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            <span className="px-2.5 py-1 bg-[#A96845] text-white text-[9px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              COMING SOON
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart
              size={16}
              className={isWishlisted ? 'fill-accent text-accent' : 'text-text'}
            />
          </button>

          {/* Quick Add */}
          {showAddToCart && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 h-9 px-4 rounded-xl bg-accent text-white text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent-hover"
              aria-label="Add to cart"
            >
              {addedToCart ? (
                <>✓ Added</>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  Add
                </>
              )}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted mb-1.5">
            {product.category}
          </p>
          <h3 className="font-display text-base font-medium text-text mb-2 leading-snug group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-accent text-accent'
                      : 'text-border'
                  }
                />
              ))}
            </div>
            <span className="text-[11px] text-muted">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-accent">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <p className={`text-xs mt-1.5 ${stockStatus.color}`}>{stockStatus.text}</p>
        </div>
      </div>
    </Link>
  );
}
