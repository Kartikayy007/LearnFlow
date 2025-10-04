import { NextRequest, NextResponse } from 'next/server';
import { generateLesson } from '@/lib/ai/generator';
import { createLesson, updateLesson } from '@/lib/db/queries';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  let lessonId: string | null = null;

  try {
    const body = await request.json();
    const { outline, model = 'smart' } = body;

    if (!outline || typeof outline !== 'string') {
      return NextResponse.json(
        { error: 'Outline is required' },
        { status: 400 }
      );
    }

    const lesson = await createLesson({ outline });
    lessonId = lesson.id;

    try {
      const result = await generateLesson(outline, model);

      await updateLesson(lessonId, {
        content: result.content,
        title: result.title,
        status: 'generated'
      });

      return NextResponse.json({
        success: true,
        lessonId,
        message: 'Lesson generated successfully'
      });

    } catch (generationError) {
      await updateLesson(lessonId, {
        status: 'failed',
        error_message: generationError instanceof Error ? generationError.message : 'Unknown generation error'
      });

      throw generationError;
    }

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate lesson',
        details: error instanceof Error ? error.message : 'Unknown error',
        lessonId
      },
      { status: 500 }
    );
  }
}