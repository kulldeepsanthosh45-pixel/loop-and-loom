'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Award, Video, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { courses } from '@/lib/data';
import CourseCard from '@/components/CourseCard';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [selectedLevel, searchQuery]);

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      {/* Academy Hero */}
      <section className="bg-gradient-to-b from-card to-bg border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Loop &amp; Loom Online Academy
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-text mb-4 max-w-2xl mx-auto">
            Master the Meditative Art of Crochet
          </h1>
          <p className="text-sm text-muted max-w-xl mx-auto font-body leading-relaxed mb-8">
            Step-by-step masterclasses designed for beginners and seasoned makers alike. Learn heirloom stitches, master colorwork, and handcraft modern accessories at your own pace.
          </p>

          {/* Quick Perks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 border-t border-border/60">
            <div className="flex items-center justify-center gap-2 text-xs text-text">
              <Video className="w-4 h-4 text-accent" />
              <span>Full HD Close-ups</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-text">
              <Clock className="w-4 h-4 text-accent" />
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-text">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>Downloadable Patterns</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-text">
              <Award className="w-4 h-4 text-accent" />
              <span>Artisan Certificate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls: Search and Level Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Level Filter Tabs */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`text-xs font-medium px-4 py-2 rounded-xl transition-all ${
                  selectedLevel === level
                    ? 'bg-accent text-card shadow-sm'
                    : 'bg-card text-muted hover:text-text border border-border'
                }`}
              >
                {level} {level !== 'All' ? 'Level' : 'Courses'}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crochet courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:border-accent text-text"
            />
          </div>
        </div>

        {/* Results Count */}
        <p className="text-xs text-muted mb-6">
          Showing <span className="font-semibold text-text">{filteredCourses.length}</span> curated course{filteredCourses.length !== 1 ? 's' : ''}
        </p>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="font-display text-xl text-text mb-2">No Courses Found</h3>
            <p className="text-xs text-muted mb-6">
              Try adjusting your search criteria or explore other skill levels.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold bg-accent text-card px-4 py-2 rounded-xl hover:bg-accent/90"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
