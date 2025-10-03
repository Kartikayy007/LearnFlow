import { NextRequest, NextResponse } from 'next/server';
import { createLesson, updateLesson } from '@/lib/db/queries';
import { generateLesson } from '@/lib/ai/generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { outline } = body;

    if (!outline || typeof outline !== 'string') {
      return NextResponse.json(
        { error: 'Outline is required' },
        { status: 400 }
      );
    }

    const lesson = await createLesson({ outline });
    generateLessonAsync(lesson.id, outline);

    return NextResponse.json({
      lessonId: lesson.id,
      message: 'Lesson generation started',
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to start lesson generation' },
      { status: 500 }
    );
  }
}

async function generateLessonAsync(lessonId: string, outline: string) {
  try {
    const content = await generateLesson(outline);

    await updateLesson(lessonId, {
      status: 'generated',
      content,
    });

  } catch (error) {
    await updateLesson(lessonId, {
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Generation failed',
    });
  }
}