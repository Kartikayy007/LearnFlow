'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BlurText from '@/components/ui/BlurText';

interface Lesson {
  id: string;
  title: string;
  outline: string;
  status: 'generating' | 'generated' | 'failed';
  content?: string;
  error_message?: string;
}

export default function LessonViewPage() {
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [jsCode, setJsCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [transpiling, setTranspiling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  useEffect(() => {
    if (lesson?.content && !jsCode) {
      transpileCode(lesson.content);
    }
  }, [lesson, jsCode]);

  useEffect(() => {
    if (lesson?.status === 'generating') {
      const interval = setInterval(() => {
        fetchLesson();
      }, 5000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.status]);

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (!response.ok) throw new Error('Failed to fetch lesson');
      const data = await response.json();
      setLesson(data);
    } catch {
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const transpileCode = async (tsCode: string) => {
    setTranspiling(true);
    try {
      const response = await fetch('/api/transpile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: tsCode })
      });
      const result = await response.json();
      if (result.success) {
        setJsCode(result.javascript);
      } else {
        setError('Failed to transpile code');
      }
    } catch {
      setError('Failed to transpile code');
    } finally {
      setTranspiling(false);
    }
  };

  const getIframeContent = () => {
    if (!jsCode) return '';

    const encoder = new TextEncoder();
    const data = encoder.encode(jsCode);
    const encodedCode = btoa(String.fromCharCode(...data));

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              background: #1111;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            const { useState, useEffect, useRef, useCallback, useMemo } = React;
            try {
              const encodedCode = "${encodedCode}";
              const decodedBytes = atob(encodedCode);
              const jsCode = new TextDecoder().decode(new Uint8Array([...decodedBytes].map(char => char.charCodeAt(0))));
              eval(jsCode);
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(LessonComponent));
            } catch (err) {
              document.body.innerHTML = '<div style="color: red; padding: 20px;">Error: ' + err.message + '</div>';
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="flex-1 overflow-auto p-10 bg-background rounded-l-3xl border-l-[1px] border-l-border rounded-bl-3xl">
          {loading && (
            <div className="text-muted-foreground">Loading lesson...</div>
          )}

          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          {lesson && (
            <>
              <BlurText
                text={lesson.title}
                delay={70}
                animateBy="words"
                direction="bottom"
                className="text-5xl font-bold mb-2 text-foreground"
              />

              <p className="text-muted-foreground mb-6 italic">&ldquo;{lesson.outline}&rdquo;</p>

              {lesson.status === 'generating' && (
                <div className="text-yellow-500">Lesson is still generating...</div>
              )}

              {lesson.status === 'failed' && (
                <div className="text-red-500">
                  Lesson generation failed: {lesson.error_message}
                </div>
              )}

              {lesson.status === 'generated' && lesson.content && (
                <>
                  {transpiling && (
                    <div className="text-gray-500 mb-4">Please wait...</div>
                  )}

                  {jsCode && (
                    <div className="border-2 border-border rounded-lg overflow-hidden mt-6">
                      <iframe
                        srcDoc={getIframeContent()}
                        className="w-full h-[100vh] bg-transparent"
                        title="Lesson Content"
                        sandbox="allow-scripts"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
  );
}
