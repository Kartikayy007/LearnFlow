import { supabase } from './supabase';
import { Lesson, CreateLessonInput } from '@/types/lesson';

export async function createLesson(input: CreateLessonInput) {
  const title = extractTitle(input.outline);

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      outline: input.outline,
      title,
      status: 'generating' as const,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }

  return data as Lesson;
}

export async function getLessonById(id: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lesson:', error);
    throw error;
  }

  return data as Lesson;
}

export async function updateLesson(
  id: string,
  updates: {
    status?: 'generating' | 'generated' | 'failed';
    content?: string;
    title?: string;
    error_message?: string;
  }
) {
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }

  return data as Lesson;
}

export async function getAllLessons() {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }

  return data as Lesson[];
}

function extractTitle(outline: string): string {
  const title = outline
    .split(/[.\n]/)[0]
    .trim()
    .substring(0, 50);

  return title || 'Untitled Lesson';
}