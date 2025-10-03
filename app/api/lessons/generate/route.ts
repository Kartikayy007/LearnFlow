import { NextRequest, NextResponse } from 'next/server';
import { generateLesson } from '@/lib/ai/generator';

export const maxDuration = 300;

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

    const content = await generateLesson(outline);

    return NextResponse.json({
      success: true,
      content,
      title: outline,
      status: 'generated'
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate lesson',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}