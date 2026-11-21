'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Users, 
  Star, 
  CheckCircle2, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  ShieldCheck, 
  Share2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { courses } from '@/lib/data';
import { useAuthStore } from '@/lib/auth-store';

function CourseDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const course = courses.find((c) => c.slug === slug) || courses[0];

  const { isEnrolled, enrollInCourse, isAuthenticated } = useAuthStore();
  const enrolled = isEnrolled(course.id);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true,
  });
  const [previewVideoModal, setPreviewVideoModal] = useState<string | null>(null);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${course.slug}`);
      return;
    }
    enrollInCourse(course.id);
    router.push(`/learn/${course.slug}`);
  };

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-text transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-text font-medium truncate max-w-[220px]">{course.title}</span>
        </nav>
      </div>

      {/* Hero Header */}
      <section className="bg-card border-y border-border py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/15 text-accent uppercase tracking-wider">
                  {course.level} Level
                </span>
                <span className="text-xs text-muted">
                  Taught by <strong className="text-text">{course.instructor}</strong>
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-text">
                {course.title}
              </h1>

              <p className="text-sm text-muted font-body leading-relaxed max-w-2xl">
                {course.longDescription || course.description}
              </p>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{course.duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span>{course.lessonCount} step-by-step lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-accent" />
                  <span>{course.studentCount} enrolled students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                  <span className="font-semibold text-text">{course.rating}</span>
                  <span>({course.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Right Side Video Preview Poster */}
            <div className="lg:col-span-5">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-md group bg-black/5">
                <Image
                  src={course.image || '/images/hero-banner.jpg'}
                  alt={course.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center p-4">
                  <button
                    type="button"
                    onClick={() => setPreviewVideoModal(course.modules[0]?.lessons[0]?.title || 'Preview')}
                    className="w-14 h-14 rounded-full bg-accent text-card flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    aria-label="Play course preview"
                  >
                    <Play className="w-6 h-6 fill-card ml-1" />
                  </button>
                  <span className="text-card text-xs font-semibold mt-3 tracking-wide drop-shadow-sm">
                    Watch Free Course Preview (5 mins)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Enrollment Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* What you'll learn */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
              <h2 className="font-display text-2xl text-text mb-4">What You Will Master</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-start gap-2.5 text-xs text-text">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Master yarn tension, ergonomic hook grips &amp; foundation chains</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-text">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Read written crochet charts and international standard abbreviations</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-text">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Seamless color transitions and invisible weaving ends</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-text">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Complete 3 tangible handmade finished projects from start to finish</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-text">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Blocking techniques to achieve professional boutique finish</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-text">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Lifetime access to downloadable printable stitch charts &amp; cheat sheets</span>
                </div>
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl text-text">Curriculum Syllabus</h2>
                  <p className="text-xs text-muted mt-0.5">
                    {course.modules.length} modules · {course.lessonCount} video lessons
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = Object.values(expandedModules).every(Boolean);
                    const next: Record<string, boolean> = {};
                    course.modules.forEach((m) => {
                      next[m.id] = !allOpen;
                    });
                    setExpandedModules(next);
                  }}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Expand / Collapse All
                </button>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod, modIdx) => {
                  const isOpen = expandedModules[mod.id] ?? false;
                  return (
                    <div
                      key={mod.id}
                      className="bg-card rounded-2xl border border-border overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-bg/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-bg-alt/40 text-text text-xs font-semibold flex items-center justify-center">
                            {modIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-text">{mod.title}</h3>
                            <span className="text-[11px] text-muted">{mod.lessons.length} lessons</span>
                          </div>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                      </button>

                      {isOpen && (
                        <div className="border-t border-border divide-y divide-border/60 bg-bg/20">
                          {mod.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="px-5 py-3 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.isPreview ? (
                                  <Play className="w-3.5 h-3.5 text-accent" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-muted" />
                                )}
                                <span className={lesson.isPreview ? 'font-medium text-text' : 'text-muted'}>
                                  {lesson.title}
                                </span>
                                {lesson.isPreview && (
                                  <span className="text-[10px] bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-muted">{lesson.duration}</span>
                                {lesson.isPreview ? (
                                  <Link
                                    href={`/learn/${course.slug}?lesson=${lesson.id}`}
                                    className="text-[11px] font-semibold text-accent hover:underline"
                                  >
                                    Watch Preview
                                  </Link>
                                ) : (
                                  <span className="text-[11px] text-muted/60">Enrolled only</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor Bio */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
              <h2 className="font-display text-2xl text-text mb-4">Meet Your Mentor</h2>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border flex-shrink-0">
                  <Image
                    src="/images/maker-portrait.jpg"
                    alt={course.instructor}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text text-base">{course.instructor}</h3>
                    <span className="text-[10px] bg-bg-alt/50 text-text px-2 py-0.5 rounded-full font-medium">Master Artisan</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    With over a decade of yarn crafting expertise, Priya founded Loop &amp; Loom to celebrate mindful slow-fashion. She has mentored over 1,500 students worldwide to embrace the calm and joy of handmade crochet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Enrollment Card Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-display font-semibold text-accent">
                  ₹{course.price.toLocaleString('en-IN')}
                </span>
                {course.comparePrice && (
                  <span className="text-sm text-muted line-through">
                    ₹{course.comparePrice.toLocaleString('en-IN')}
                  </span>
                )}
                {course.comparePrice && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Save {Math.round(((course.comparePrice - course.price) / course.comparePrice) * 100)}%
                  </span>
                )}
              </div>

              {enrolled ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    You are enrolled in this course!
                  </div>
                  <Link
                    href={`/learn/${course.slug}`}
                    className="w-full bg-accent text-card font-medium py-3 px-4 rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 text-xs text-center"
                  >
                    <span>Resume Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    className="w-full bg-[#D8C4A8] text-[#594333] font-semibold py-3.5 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 text-xs"
                  >
                    <span>✦ Enrollment Coming Soon ✦</span>
                  </button>
                  <p className="text-[10px] text-center text-muted">
                    Batches opening shortly · Stay tuned
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-border space-y-2.5 text-xs text-text">
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-2">
                  This masterclass includes:
                </h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>{course.duration} on-demand HLS video</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-accent" />
                  <span>{course.lessonCount} downloadable stitch patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-accent" />
                  <span>Certificate upon completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Artisan community Q&amp;A support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Video Preview Modal */}
      {previewVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-text">Free Lesson Preview</h3>
              <button
                type="button"
                onClick={() => setPreviewVideoModal(null)}
                className="text-xs text-muted hover:text-text font-semibold px-2 py-1 rounded-lg border border-border"
              >
                Close ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted mt-3">
              Previewing lesson: <strong className="text-text">{previewVideoModal}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-20 text-center text-xs text-muted">Loading course details...</div>}>
      <CourseDetailContent />
    </Suspense>
  );
}
