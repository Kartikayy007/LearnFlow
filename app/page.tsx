export default function HomePage() {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-foreground mb-4">LearnFlow API</h1>
      <p className="text-lg text-muted-foreground mb-10">Backend API for generating educational lessons with AI</p>

      <div className="mt-10 p-6 bg-card rounded-lg border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">API Endpoints</h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">1. Generate Lesson</h3>
            <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">POST /api/lessons/generate</code>
            <pre className="bg-muted text-muted-foreground p-3 rounded mt-3 overflow-x-auto">
{`Body: { "outline": "A 10 question quiz about space" }`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">2. Get All Lessons</h3>
            <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">GET /api/lessons</code>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">3. Get Lesson by ID</h3>
            <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">GET /api/lessons/[id]</code>
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 bg-secondary rounded-lg">
        <h2 className="text-2xl font-semibold text-secondary-foreground mb-4">Quick Test</h2>
        <p className="text-secondary-foreground mb-3">Open console (F12) and run:</p>
        <pre className="bg-primary text-primary-foreground p-3 rounded overflow-x-auto">
{`fetch('/api/lessons/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ outline: 'Test lesson' })
}).then(r => r.json()).then(console.log)`}
        </pre>
      </div>

      <div className="mt-10">
        <p className="text-muted-foreground">
          Database: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Connected' : '❌ Not connected'}<br/>
          AI: {process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}
        </p>
      </div>
    </div>
  );
}