import { NextRequest, NextResponse } from 'next/server';
import { getAllLessons } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const lessons = await getAllLessons();
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}