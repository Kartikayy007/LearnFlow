import { NextRequest, NextResponse } from 'next/server';
import { generateLesson } from '@/lib/ai/generator';
import { createLesson, updateLesson } from '@/lib/db/queries';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  let lessonId: string | null = null;

  try {
    const body = await request.json();
    const { outline } = body;

    if (!outline || typeof outline !== 'string') {
      return NextResponse.json(
        { error: 'Outline is required' },
        { status: 400 }
      );
    }

    // Step 1: Create database entry with 'generating' status
    const lesson = await createLesson({ outline });
    lessonId = lesson.id;

    try {
      // Step 2: Generate content with AI
      const content = await generateLesson(outline);

      // Step 3: Update database with generated content
      await updateLesson(lessonId, {
        content,
        status: 'generated'
      });

      // Step 4: Return lesson ID for retrieval
      return NextResponse.json({
        success: true,
        lessonId,
        message: 'Lesson generated successfully'
      });

    } catch (generationError) {
      // Update database with failed status if generation fails
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