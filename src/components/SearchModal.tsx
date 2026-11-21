'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { products, courses } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const filteredProducts = query.length >= 2
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredCourses = query.length >= 2
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[100] bg-text/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-w-2xl mx-auto mt-24 bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <SearchIcon size={20} className="text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, courses..."
            className="flex-1 bg-transparent text-text placeholder:text-muted outline-none text-base"
            aria-label="Search products and courses"
          />
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-text transition-colors"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.length >= 2 && filteredProducts.length === 0 && filteredCourses.length === 0 && (
            <div className="px-6 py-12 text-center text-muted">
              <p className="text-base mb-1">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm">Try searching for something else</p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="px-6 py-4">
              <h3 className="text-xs uppercase tracking-wider text-muted font-medium mb-3">Products</h3>
              <div className="space-y-2">
                {filteredProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-bg transition-colors"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-bg">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{product.name}</p>
                      <p className="text-xs text-muted">{product.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-accent">{formatPrice(product.price)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredCourses.length > 0 && (
            <div className="px-6 py-4 border-t border-border">
              <h3 className="text-xs uppercase tracking-wider text-muted font-medium mb-3">Courses</h3>
              <div className="space-y-2">
                {filteredCourses.slice(0, 3).map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-bg transition-colors"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-bg">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{course.title}</p>
                      <p className="text-xs text-muted">{course.level} · {course.duration}</p>
                    </div>
                    <span className="text-sm font-semibold text-accent">{formatPrice(course.price)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query.length < 2 && (
            <div className="px-6 py-8 text-center text-muted">
              <p className="text-sm">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
