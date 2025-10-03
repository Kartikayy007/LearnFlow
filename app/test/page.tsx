'use client';

import { useState } from 'react';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRendered, setShowRendered] = useState(false);

  const generateLesson = async () => {
    setLoading(true);
    setError(null);
    setLessonData(null);
    setShowRendered(false);

    try {
      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outline: 'Create an interactive quiz about space and planets' }),
      });

      const data = await response.json();
      setLessonId(data.lessonId);

      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const lessonResponse = await fetch(`/api/lessons/${data.lessonId}`);
        const lesson = await lessonResponse.json();

        if (lesson.status === 'generated') {
          setLessonData(lesson);
          break;
        } else if (lesson.status === 'failed') {
          setError(lesson.error_message || 'Generation failed');
          break;
        }

        attempts++;
      }

      if (attempts >= maxAttempts) {
        setError('Generation timeout');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getIframeContent = () => {
    if (!lessonData?.content) return '';

    const jsCode = lessonData.content;

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
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <div id="error"></div>

          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script type="text/babel">
            const { useState, useEffect, useRef, useCallback, useMemo } = React;

            ${jsCode}

            const root = ReactDOM.createRoot(document.getElementById('root'));

            try {
              root.render(<LessonComponent />);
            } catch (err) {
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').innerText = 'Error: ' + err.message;
            }

          </script>

          <script>
            window.addEventListener('error', (e) => {
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').innerText = 'Error: ' + e.message;
            });
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Simple Test Page (Pure JavaScript + Inline Styles)</h1>

      <button
        onClick={generateLesson}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Generating...' : 'Generate Lesson'}
      </button>

      {lessonId && (
        <div style={{ marginTop: '20px' }}>
          <strong>Lesson ID:</strong> {lessonId}
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {lessonData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Lesson Generated!</h2>

          <div style={{ marginTop: '10px' }}>
            <strong>Status:</strong> {lessonData.status} ✓
          </div>

          <div style={{ marginTop: '10px' }}>
            <strong>Title:</strong> {lessonData.title}
          </div>

          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Generated JavaScript Code (click to expand)
            </summary>
            <pre style={{
              backgroundColor: '#f4f4f4',
              padding: '15px',
              borderRadius: '5px',
              overflow: 'auto',
              maxHeight: '400px',
              border: '1px solid #ddd',
              marginTop: '10px',
            }}>
              {lessonData.content}
            </pre>
          </details>

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setShowRendered(!showRendered)}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {showRendered ? 'Hide Component' : 'Show Component'}
            </button>
          </div>

          {showRendered && (
            <>
              <h3 style={{ marginTop: '20px' }}>Rendered Component:</h3>
              <div style={{
                marginTop: '10px',
                border: '2px solid #0070f3',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
                <iframe
                  srcDoc={getIframeContent()}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: 'none',
                  }}
                  title="Rendered Lesson"
                  sandbox="allow-scripts"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}