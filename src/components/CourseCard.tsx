'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, BookOpen, Users } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-accent/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(169,104,69,0.08)]">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-bg">
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-text/30 to-transparent" />

          {/* Level badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#A96845] text-white shadow-sm">
              COMING SOON
            </span>
            <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-card/90 text-text">
              {course.level}
            </span>
          </div>

          {/* Play preview indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                <path d="M8 5v14l11-7L8 5z" fill="#A96845" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-display text-lg font-medium text-text mb-2 leading-snug group-hover:text-accent transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted mb-3 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-3 text-xs text-muted">
            <div className="flex items-center gap-1">
              <Clock size={13} />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={13} />
              <span>{course.lessonCount} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={13} />
              <span>{course.studentCount}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.floor(course.rating)
                      ? 'fill-accent text-accent'
                      : 'text-border'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-muted">
              {course.rating} ({course.reviewCount} reviews)
            </span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-accent">
                {formatPrice(course.price)}
              </span>
              {course.comparePrice && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(course.comparePrice)}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#A96845]/15 text-[#A96845]">
              Coming Soon ✦
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
