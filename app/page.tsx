export default function HomePage() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>LearnFlow API</h1>
      <p>Backend API for generating educational lessons with AI</p>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>API Endpoints</h2>

        <div style={{ marginTop: '20px' }}>
          <h3>1. Generate Lesson</h3>
          <code style={{ backgroundColor: '#222', color: '#0f0', padding: '5px' }}>POST /api/lessons/generate</code>
          <pre style={{ backgroundColor: '#333', color: '#0f0', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
{`Body: { "outline": "A 10 question quiz about space" }`}
          </pre>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>2. Get All Lessons</h3>
          <code style={{ backgroundColor: '#222', color: '#0f0', padding: '5px' }}>GET /api/lessons</code>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>3. Get Lesson by ID</h3>
          <code style={{ backgroundColor: '#222', color: '#0f0', padding: '5px' }}>GET /api/lessons/[id]</code>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <h2>Quick Test</h2>
        <p>Open console (F12) and run:</p>
        <pre style={{ backgroundColor: '#333', color: '#0f0', padding: '10px', borderRadius: '4px' }}>
{`fetch('/api/lessons/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ outline: 'Test lesson' })
}).then(r => r.json()).then(console.log)`}
        </pre>
      </div>

      <div style={{ marginTop: '40px' }}>
        <p style={{ color: '#666' }}>
          Database: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Connected' : '❌ Not connected'}<br/>
          AI: {process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}
        </p>
      </div>
    </div>
  );
}