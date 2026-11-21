import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { courseId, lessonId, userId, isPreview } = await req.json();

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: 'Missing course or lesson ID' }, { status: 400 });
    }

    // 1. If it's a marked free-preview lesson, access is granted to anyone
    if (isPreview) {
      const publicPlaybackToken = crypto
        .createHash('sha256')
        .update(`preview_${courseId}_${lessonId}_${Date.now()}`)
        .digest('hex');

      return NextResponse.json({
        authorized: true,
        isPreview: true,
        playbackToken: publicPlaybackToken,
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        expiresIn: 3600,
      });
    }

    // 2. For non-preview lessons, user must be authenticated and enrolled
    if (!userId) {
      return NextResponse.json(
        { authorized: false, error: 'Authentication required to access full lesson' },
        { status: 401 }
      );
    }

    // In production with PostgreSQL/Prisma:
    // const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
    // if (!enrollment) return NextResponse.json({ authorized: false, error: 'Enrollment required' }, { status: 403 });

    // Generate signed playback token for Mux / Cloudflare Stream
    const secret = process.env.MUX_SIGNING_KEY || process.env.CLOUDFLARE_STREAM_TOKEN || 'secure-stream-secret';
    const signedPlaybackToken = crypto
      .createHmac('sha256', secret)
      .update(`${userId}:${courseId}:${lessonId}:${Math.floor(Date.now() / 1000) + 7200}`)
      .digest('hex');

    return NextResponse.json({
      authorized: true,
      isPreview: false,
      playbackToken: signedPlaybackToken,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      expiresIn: 7200,
    });
  } catch (error: any) {
    console.error('Course token authorization error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authorization failed' },
      { status: 500 }
    );
  }
}
