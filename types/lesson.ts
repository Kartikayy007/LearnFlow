export interface Lesson {
  id: string;
  outline: string;
  title: string;
  status: 'generating' | 'generated' | 'failed';
  content?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonInput {
  outline: string;
}

export interface GenerateLessonResponse {
  lessonId: string;
}