'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Lesson {
  id: string;
  title: string;
  outline: string;
  status: 'generating' | 'generated' | 'failed';
  created_at: string;
}

export function YourLessons() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      setError('Failed to load lessons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'generating':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-0">
        <h1 className='text-3xl font-bold text-foreground mb-6 text-left'>
          Your Lessons
        </h1>
        <div className="text-muted-foreground">Loading lessons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-0">
        <h1 className='text-3xl font-bold text-foreground mb-6 text-left'>
          Your Lessons
        </h1>
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-0">
        <h1 className='text-3xl font-bold text-foreground mb-6 text-left'>
          Your Lessons
        </h1>
        <div className="text-muted-foreground">
          No lessons yet. Create your first lesson above!
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-32 max-w-5xl mx-auto cursor-pointer px-4 sm:px-8 lg:px-0">
      <h1 className='text-3xl font-bold text-foreground mb-6 text-left relative inline-block'>
        <span className="relative">
          Your Lessons
        </span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => router.push(`/lessons/${lesson.id}`)}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                {lesson.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(lesson.status)}`}>
                {lesson.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {lesson.outline}
            </p>
            <div className="text-xs text-muted-foreground">
              {formatDate(lesson.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
