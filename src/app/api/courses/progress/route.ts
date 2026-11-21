import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, lessonId, lastPositionSec, isCompleted } = await req.json();

    if (!userId || !lessonId) {
      return NextResponse.json({ error: 'Missing userId or lessonId' }, { status: 400 });
    }

    // In production with PostgreSQL/Prisma:
    // await prisma.lessonProgress.upsert({
    //   where: { userId_lessonId: { userId, lessonId } },
    //   update: {
    //     lastPositionSec,
    //     completedAt: isCompleted ? new Date() : undefined,
    //   },
    //   create: {
    //     userId,
    //     lessonId,
    //     lastPositionSec,
    //     completedAt: isCompleted ? new Date() : null,
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: {
        userId,
        lessonId,
        lastPositionSec,
        completedAt: isCompleted ? new Date().toISOString() : null,
      },
    });
  } catch (error: any) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
}
