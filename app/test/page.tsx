'use client';

import { useState, useEffect } from 'react';
import { StaggeredMenu } from '@/components/staggered-menu';

interface Lesson {
  id: string;
  outline: string;
  title: string;
  status: 'generating' | 'generated' | 'failed';
  content?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [lessonData, setLessonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRendered, setShowRendered] = useState(false);
  const [jsCode, setJsCode] = useState<string | null>(null);
  const [transpiling, setTranspiling] = useState(false);

  // New state for lesson list
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Fetch all lessons
  const fetchAllLessons = async () => {
    setLoadingLessons(true);
    setError(null);
    try {
      const response = await fetch('/api/lessons');
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      setError('Failed to fetch lessons');
      console.error('Error fetching lessons:', err);
    } finally {
      setLoadingLessons(false);
    }
  };

  // Load specific lesson
  const loadLesson = async (lessonId: string) => {
    setLoading(true);
    setError(null);
    setLessonData(null);
    setJsCode(null);
    setShowRendered(false);
    setSelectedLessonId(lessonId);

    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (!response.ok) {
        throw new Error('Failed to load lesson');
      }
      const lesson = await response.json();

      if (lesson.status === 'generated' && lesson.content) {
        setLessonData({
          success: true,
          content: lesson.content,
          title: lesson.title,
          status: 'generated'
        });
      } else if (lesson.status === 'failed') {
        setError(lesson.error_message || 'Lesson generation failed');
      } else {
        setError('Lesson is still generating');
      }
    } catch (err) {
      setError('Failed to load lesson');
      console.error('Error loading lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load lessons on mount
  useEffect(() => {
    fetchAllLessons();
  }, []);

  const generateLesson = async () => {
    setLoading(true);
    setError(null);
    setLessonData(null);
    setShowRendered(false);
    setJsCode(null);
    setSelectedLessonId(null);

    try {
      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outline:
            'simple addition',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.lessonId) {
        // API now returns lesson ID, so we need to fetch the lesson
        console.log('Lesson created with ID:', data.lessonId);

        // Refresh the lesson list first
        await fetchAllLessons();

        // Then load the newly generated lesson
        await loadLesson(data.lessonId);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonData?.content && !jsCode) {
      transpileTypeScript(lessonData.content);
    }
  }, [lessonData, jsCode]);

  const transpileTypeScript = async (tsCode: string) => {
    setTranspiling(true);
    setError(null);

    try {
      console.log('Starting server-side transpilation...');
      const response = await fetch('/api/transpile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: tsCode })
      });

      const result = await response.json();

      if (result.success) {
        console.log('Transpilation successful, JavaScript length:', result.javascript.length);
        setJsCode(result.javascript);
        setShowRendered(true);
      } else {
        setError(`Transpilation failed: ${result.error}`);
        console.error('Transpilation error:', result.error);
      }
    } catch (err) {
      console.error('Failed to transpile:', err);
      setError('Failed to transpile TypeScript code');
    } finally {
      setTranspiling(false);
    }
  };

  const getIframeContent = () => {
    if (!jsCode) return '';

    // Base64 encode the JavaScript code to safely pass it to the iframe
    // Convert string to base64 without using deprecated unescape
    const encoder = new TextEncoder();
    const data = encoder.encode(jsCode);
    const encodedCode = btoa(String.fromCharCode(...data));

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Lesson</title>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              background: #f5f5f5;
            }
            #error {
              color: red;
              padding: 10px;
              background: #fee;
              border: 1px solid #fcc;
              border-radius: 4px;
              margin: 10px 0;
              display: none;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <div id="error"></div>

          <script>
            const { useState, useEffect, useRef, useCallback, useMemo } = React;

            try {
              console.log('Decoding and executing JavaScript...');

              // Decode the Base64 encoded JavaScript
              const encodedCode = "${encodedCode}";
              const decodedBytes = atob(encodedCode);
              const jsCode = new TextDecoder().decode(new Uint8Array([...decodedBytes].map(char => char.charCodeAt(0))));

              console.log('JavaScript code length:', jsCode.length);

              // Execute the JavaScript
              eval(jsCode);

              if (typeof LessonComponent === 'undefined') {
                throw new Error('LessonComponent not found after code execution');
              }

              // Render the component
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(LessonComponent));
              console.log('Component rendered successfully');

            } catch (err) {
              console.error('Execution error:', err);
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').innerText = 'Error: ' + err.message + '\\nStack: ' + err.stack;
            }
          </script>

          <script>
            window.addEventListener('error', (e) => {
              console.error('Window error:', e);
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').innerText = 'Error: ' + e.message;
            });
          </script>
        </body>
      </html>
    `;
  };

  return (
    <>
      <StaggeredMenu />
      <div className="p-6 font-mono bg-background text-foreground min-h-screen">
      <h1 className="text-3xl font-bold mb-6">LearnFlow Test Page</h1>

      <div className="flex gap-4 items-center mb-6">
        <button
          onClick={generateLesson}
          disabled={loading}
          className={`px-5 py-2 rounded text-base font-medium transition-colors ${
            loading
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90 cursor-pointer'
          }`}
        >
          {loading ? 'Processing...' : 'Generate New Lesson (Solar System)'}
        </button>
        <span className="text-muted-foreground">OR select a lesson from the list below</span>
      </div>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {transpiling && (
        <div style={{ marginTop: '20px', color: 'blue' }}>
          <strong>Transpiling TypeScript to JavaScript...</strong>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        borderTop: '2px solid #ccc',
        paddingTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Existing Lessons</h2>
          <button
            onClick={fetchAllLessons}
            disabled={loadingLessons}
            style={{
              padding: '5px 15px',
              fontSize: '14px',
              backgroundColor: loadingLessons ? '#ccc' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loadingLessons ? 'not-allowed' : 'pointer',
            }}
          >
            {loadingLessons ? 'Loading...' : 'Refresh List'}
          </button>
        </div>

        {lessons.length > 0 && (
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px'
          }}>
            {lessons.map(lesson => (
              <div
                key={lesson.id}
                style={{
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedLessonId === lesson.id ? '#e3f2fd' : 'white',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => loadLesson(lesson.id)}
                onMouseEnter={(e) => {
                  if (selectedLessonId !== lesson.id) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLessonId !== lesson.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {lesson.title}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <span style={{
                    display: 'inline-block',
                    marginRight: '15px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    backgroundColor:
                      lesson.status === 'generated' ? '#d4edda' :
                      lesson.status === 'failed' ? '#f8d7da' :
                      '#fff3cd',
                    color:
                      lesson.status === 'generated' ? '#155724' :
                      lesson.status === 'failed' ? '#721c24' :
                      '#856404',
                  }}>
                    {lesson.status}
                  </span>
                  Created: {new Date(lesson.created_at).toLocaleString()}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {lesson.outline}
                </div>
              </div>
            ))}
          </div>
        )}

        {lessons.length === 0 && !loadingLessons && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No lessons found. Generate one to get started!
          </p>
        )}
      </div>

      {lessonData && (
        <div style={{ marginTop: '30px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
          <h2>
            {selectedLessonId ? '📖 Loaded Lesson' : '✅ Generated Lesson'}
          </h2>

          <div style={{ marginTop: '10px' }}>
            <strong>Title:</strong> {lessonData.title}
          </div>

          <details style={{ marginTop: '20px' }}>
            <summary
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              Generated TypeScript Code (click to expand)
            </summary>
            <pre
              style={{
                backgroundColor: '#f4f4f4',
                padding: '15px',
                borderRadius: '5px',
                overflow: 'auto',
                maxHeight: '400px',
                border: '1px solid #ddd',
                marginTop: '10px',
              }}
            >
              {lessonData.content}
            </pre>
          </details>

          {jsCode && (
            <details style={{ marginTop: '20px' }}>
              <summary
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Transpiled JavaScript Code (click to expand)
              </summary>
              <pre
                style={{
                  backgroundColor: '#e8f5e9',
                  padding: '15px',
                  borderRadius: '5px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  border: '1px solid #4caf50',
                  marginTop: '10px',
                }}
              >
                {jsCode}
              </pre>
            </details>
          )}

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setShowRendered(!showRendered)}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
              disabled={!jsCode}
            >
              {showRendered ? 'Hide' : 'Show'} Rendered Component
            </button>
          </div>

          {showRendered && jsCode && (
            <div style={{ marginTop: '20px' }}>
              <h3>Rendered Component:</h3>
              <div
                style={{
                  border: '2px solid #28a745',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginTop: '10px',
                }}
              >
                <iframe
                  srcDoc={getIframeContent()}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: 'none',
                    background: 'white',
                  }}
                  title="Generated Lesson"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}