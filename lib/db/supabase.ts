import { createClient } from '@supabase/supabase-js';
import { Lesson } from '@/types/lesson';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Database = {
  public: {
    Tables: {
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Lesson, 'id' | 'created_at'>>;
      };
    };
  };
};