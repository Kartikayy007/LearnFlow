'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [lessonData, setLessonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRendered, setShowRendered] = useState(false);
  const [jsCode, setJsCode] = useState<string | null>(null);
  const [transpiling, setTranspiling] = useState(false);

  const generateLesson = async () => {
    setLoading(true);
    setError(null);
    setLessonData(null);
    setShowRendered(false);
    setJsCode(null);

    try {
      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outline:
            'A 10 question quiz on michecal jackson with his pictures',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setLessonData(data);
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
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Simple Test Page - Direct API Response</h1>

      <button
        onClick={generateLesson}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Generating...' : 'Generate Lesson (Cartesian Grid)'}
      </button>

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

      {lessonData && (
        <div style={{ marginTop: '20px' }}>
          <h2>✅ Lesson Generated Successfully!</h2>

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
                backgroundColor: '#1111',
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
                  backgroundColor: '#1111',
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
  );
}