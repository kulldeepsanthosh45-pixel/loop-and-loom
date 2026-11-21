import Image from 'next/image';
import Link from 'next/link';
import { Heart, Sparkles, Users, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      {/* Hero */}
      <section className="bg-card border-b border-border py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold flex items-center justify-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Our Story &amp; Philosophy
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text mb-6">
            Mindful Loops, Timeless Craftsmanship
          </h1>
          <p className="text-base text-muted font-body leading-relaxed">
            Loop &amp; Loom was born from a desire to slow down in a fast-paced world. We believe that true luxury is not mass-produced in factories; it is woven slowly with patience, care, and human warmth.
          </p>
        </div>
      </section>

      {/* Story Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-md">
            <Image
              src="/images/maker-portrait.jpg"
              alt="Priya Sharma, Founder & Artisan"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">
              The Artisan Hand
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-text">
              Every Stitch Tells a Story of Dedication
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Founded by textile artisan Priya Sharma, Loop &amp; Loom began as a small home studio in Bengaluru. Today, we work with a dedicated collective of skilled women artisans across India, creating heirloom-grade crochet accessories while preserving heritage textile arts.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              We exclusively use ethically sourced, 100% natural cotton yarns dyed with skin-safe, azo-free pigments. Our slow-fashion model ensures zero microplastic waste and fair living wages for all maker artisans.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <span className="font-display text-3xl text-accent font-bold">100%</span>
                <p className="text-xs text-muted mt-0.5">Handmade with Zero Machinery</p>
              </div>
              <div>
                <span className="font-display text-3xl text-accent font-bold">1,500+</span>
                <p className="text-xs text-muted mt-0.5">Students Mentored in Academy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-card border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl text-text mb-2">Our Guiding Pillars</h2>
            <p className="text-xs text-muted">What makes Loop &amp; Loom a beloved slow-fashion haven</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-bg border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl text-text">Mindful Slow Fashion</h3>
              <p className="text-xs text-muted leading-relaxed">
                Small batches, made with intention and zero shortcuts. Each piece is designed to be cherished across seasons.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bg border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl text-text">Women Artisan Collective</h3>
              <p className="text-xs text-muted leading-relaxed">
                Empowering independent women makers with flexible home-based crafts, sustainable incomes, and creative joy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bg border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl text-text">Preserving Knowledge</h3>
              <p className="text-xs text-muted leading-relaxed">
                Through our Online Academy, we pass down generations of stitch wisdom to future craft enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-16">
        <h2 className="font-display text-3xl sm:text-4xl text-text mb-3">
          Join Our Growing Community of Makers
        </h2>
        <p className="text-xs text-muted mb-8 max-w-md mx-auto">
          Explore our boutique collections or learn how to craft your own heirloom crochet pieces with our structured video masterclasses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-accent text-card text-xs font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-all"
          >
            Explore Boutique
          </Link>
          <Link
            href="/courses"
            className="border border-border text-text text-xs font-semibold py-3 px-6 rounded-xl hover:bg-card transition-all"
          >
            Start Learning Crochet
          </Link>
        </div>
      </section>
    </div>
  );
}
