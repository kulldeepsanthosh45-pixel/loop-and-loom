'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  MessageSquare, 
  FileText, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { courses } from '@/lib/data';
import { useAuthStore } from '@/lib/auth-store';

function LearnContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const course = courses.find((c) => c.slug === slug) || courses[0];

  const { isEnrolled, isAuthenticated } = useAuthStore();
  const enrolled = isEnrolled(course.id);

  // Flatten all lessons for easy navigation
  const allLessons = course.modules.flatMap((m) => m.lessons);

  // Determine active lesson
  const requestedLessonId = searchParams.get('lesson');
  const initialLesson = allLessons.find((l) => l.id === requestedLessonId) || allLessons[0];
  const [currentLesson, setCurrentLesson] = useState(initialLesson);

  // Learning progress state (stored in localStorage)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'discussion'>('notes');

  // Video player controls state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // default 3 min
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [captionsOn, setCaptionsOn] = useState(false);

  // Load completed lessons from storage
  useEffect(() => {
    const saved = localStorage.getItem(`progress_${course.id}`);
    if (saved) {
      try {
        setCompletedLessonIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [course.id]);

  // Update URL and current lesson when requestedLessonId changes
  useEffect(() => {
    if (requestedLessonId) {
      const match = allLessons.find((l) => l.id === requestedLessonId);
      if (match) setCurrentLesson(match);
    }
  }, [requestedLessonId, allLessons]);

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem(`progress_${course.id}`, JSON.stringify(next));
      return next;
    });
  };

  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  const goToNextLesson = () => {
    if (hasNext) {
      const next = allLessons[currentLessonIndex + 1];
      setCurrentLesson(next);
      router.push(`/learn/${course.slug}?lesson=${next.id}`);
    }
  };

  const goToPrevLesson = () => {
    if (hasPrevious) {
      const prev = allLessons[currentLessonIndex - 1];
      setCurrentLesson(prev);
      router.push(`/learn/${course.slug}?lesson=${prev.id}`);
    }
  };

  const canAccessLesson = enrolled || currentLesson.isPreview;

  const progressPercentage = Math.round(
    (completedLessonIds.length / Math.max(1, allLessons.length)) * 100
  );

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 180);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pt-20 bg-bg min-h-screen">
      {/* Top Bar for Learning Mode */}
      <div className="bg-card border-b border-border py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${course.slug}`}
              className="text-xs text-muted hover:text-text flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Course Overview
            </Link>
            <span className="text-border hidden sm:inline">|</span>
            <span className="font-medium text-xs text-text hidden sm:inline truncate max-w-sm">
              {course.title}
            </span>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-text">
                {completedLessonIds.length} of {allLessons.length} Completed
              </span>
              <span className="text-[10px] text-muted block">({progressPercentage}%)</span>
            </div>
            <div className="w-24 bg-border h-2 rounded-full overflow-hidden hidden sm:block">
              <div
                className="bg-accent h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main LMS Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Video Player and Tabs Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Player Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border border-border">
              {canAccessLesson ? (
                <>
                  <video
                    ref={videoRef}
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => toggleLessonComplete(currentLesson.id)}
                    className="w-full h-full object-cover"
                  />

                  {/* Captions Overlay */}
                  {captionsOn && isPlaying && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-1.5 rounded-lg max-w-lg text-center backdrop-blur-sm pointer-events-none">
                      &quot;Insert hook through the second chain, yarn over and pull through...&quot;
                    </div>
                  )}

                  {/* Player Overlay Controls */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col gap-2">
                    {/* Scrub bar */}
                    <div
                      className="w-full bg-white/30 h-1.5 rounded-full cursor-pointer relative"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        if (videoRef.current) {
                          videoRef.current.currentTime = pos * duration;
                        }
                      }}
                    >
                      <div
                        className="bg-accent h-full rounded-full relative"
                        style={{ width: `${(currentTime / Math.max(1, duration)) * 100}%` }}
                      />
                    </div>

                    {/* Bottom controls row */}
                    <div className="flex items-center justify-between text-card text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="hover:text-accent transition-colors"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.muted = !isMuted;
                              setIsMuted(!isMuted);
                            }
                          }}
                          className="hover:text-accent transition-colors"
                          aria-label="Mute/unmute"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <span className="text-[11px] font-mono text-white/80">
                          {formatSec(currentTime)} / {formatSec(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setCaptionsOn(!captionsOn)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            captionsOn ? 'bg-accent border-accent text-white' : 'border-white/50 text-white/80'
                          }`}
                        >
                          CC
                        </button>

                        <button
                          type="button"
                          onClick={handleSpeedChange}
                          className="hover:text-accent transition-colors text-[11px] font-semibold"
                        >
                          {playbackSpeed}x
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (videoRef.current) {
                              if (videoRef.current.requestFullscreen) {
                                videoRef.current.requestFullscreen();
                              }
                            }
                          }}
                          className="hover:text-accent transition-colors"
                          aria-label="Full screen"
                        >
                          <Maximize className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Locked State Overlay */
                <div className="absolute inset-0 bg-stone-900/90 text-card flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl mb-2">Enroll to Access Full Masterclass</h3>
                  <p className="text-xs text-stone-300 max-w-md mb-6 leading-relaxed">
                    This lesson is exclusively available for enrolled students. Unlock lifetime access to all {course.lessonCount} lessons and downloadable PDF pattern charts.
                  </p>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="bg-accent text-card font-semibold text-xs py-3 px-6 rounded-xl hover:bg-accent/90 transition-all shadow-md"
                  >
                    Unlock Course for ₹{course.price.toLocaleString('en-IN')}
                  </Link>
                </div>
              )}
            </div>

            {/* Lesson Title and Actions Bar */}
            <div className="bg-card rounded-2xl border border-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-accent tracking-wider">
                  Lesson {currentLessonIndex + 1} of {allLessons.length}
                </span>
                <h2 className="font-display text-2xl text-text mt-0.5">{currentLesson.title}</h2>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => toggleLessonComplete(currentLesson.id)}
                  className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    completedLessonIds.includes(currentLesson.id)
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-border text-muted hover:text-text bg-bg'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${completedLessonIds.includes(currentLesson.id) ? 'fill-emerald-600 text-card' : ''}`} />
                  <span>{completedLessonIds.includes(currentLesson.id) ? 'Completed' : 'Mark as Done'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!hasPrevious}
                    onClick={goToPrevLesson}
                    className="p-2.5 rounded-xl border border-border bg-bg text-text hover:border-accent disabled:opacity-40 transition-colors"
                    aria-label="Previous lesson"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={!hasNext}
                    onClick={goToNextLesson}
                    className="p-2.5 rounded-xl border border-border bg-bg text-text hover:border-accent disabled:opacity-40 transition-colors"
                    aria-label="Next lesson"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs for Lesson Notes, Downloads, and Q&A */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex gap-6 border-b border-border pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'notes' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Lesson Guide
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('resources')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'resources' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" /> Downloads &amp; Patterns
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('discussion')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'discussion' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Community Q&amp;A
                </button>
              </div>

              <div className="pt-6">
                {activeTab === 'notes' && (
                  <div className="space-y-4 text-xs text-text leading-relaxed">
                    <h4 className="font-semibold text-sm">Key Takeaways for &quot;{currentLesson.title}&quot;</h4>
                    <p className="text-muted">
                      Maintain an easy, even wrist tension while pulling yarn through the loops. If your stitches look too tight, relax your shoulders and try sizing up your hook by 0.5mm.
                    </p>
                    <div className="bg-bg-alt/20 p-4 rounded-xl border border-border space-y-2">
                      <span className="font-semibold text-text text-xs uppercase tracking-wider">Recommended Hook &amp; Yarn:</span>
                      <ul className="list-disc pl-4 text-muted space-y-1">
                        <li>3.5mm or 4.0mm ergonomic crochet hook</li>
                        <li>DK weight 100% natural cotton yarn (light colors work best for visibility)</li>
                        <li>Stitch markers and blunt-end tapestry needle</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-accent" />
                        <div>
                          <h5 className="text-xs font-semibold text-text">Printable_Stitch_Cheat_Sheet.pdf</h5>
                          <span className="text-[10px] text-muted">PDF Document · 1.8 MB</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Downloading stitch chart cheat sheet...')}
                        className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-accent" />
                        <div>
                          <h5 className="text-xs font-semibold text-text">Granny_Square_Pattern_Colorways.pdf</h5>
                          <span className="text-[10px] text-muted">PDF Document · 3.4 MB</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Downloading pattern charts...')}
                        className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Have a question about this step? Ask instructor Priya..."
                        className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-border bg-bg focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => alert('Your question has been posted to instructor Priya!')}
                        className="text-xs font-semibold bg-accent text-card px-4 py-2.5 rounded-xl hover:bg-accent/90"
                      >
                        Post
                      </button>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-xl border border-border bg-bg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-text">Anjali M.</span>
                          <span className="text-[10px] text-muted">2 days ago</span>
                        </div>
                        <p className="text-muted">
                          My edges were curving inward during step 2. Sizing up my hook to 4mm solved it completely!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Curriculum Sidebar Column */}
          <div className="lg:col-span-4 bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-bg-alt/20">
              <h3 className="font-display text-lg text-text">Course Curriculum</h3>
              <p className="text-[11px] text-muted">
                {course.modules.length} modules · {allLessons.length} lessons
              </p>
            </div>

            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="p-3">
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider px-2 block mb-1.5">
                    Module {modIdx + 1}: {mod.title}
                  </span>
                  <div className="space-y-1">
                    {mod.lessons.map((lesson) => {
                      const isCurrent = lesson.id === currentLesson.id;
                      const isDone = completedLessonIds.includes(lesson.id);
                      const isLocked = !enrolled && !lesson.isPreview;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            setCurrentLesson(lesson);
                            router.push(`/learn/${course.slug}?lesson=${lesson.id}`);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-all text-xs ${
                            isCurrent
                              ? 'bg-accent/10 border border-accent text-accent font-semibold'
                              : 'hover:bg-bg border border-transparent text-text'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            ) : isLocked ? (
                              <Lock className="w-4 h-4 text-muted flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-border flex-shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-muted flex-shrink-0">{lesson.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-20 text-center text-xs text-muted">Loading masterclass...</div>}>
      <LearnContent />
    </Suspense>
  );
}
