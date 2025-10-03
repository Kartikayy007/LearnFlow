# LearnFlow - AI-Powered Digital Lessons Generator

Generate interactive educational lessons using AI. Built with Next.js, Supabase, and Google Gemini.

## 🚀 Quick Start

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and run the contents of `supabase-schema.sql`
4. Go to Settings → API and copy your project URL and anon key

### 2. Get Gemini API Key (FREE!)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key"
3. Copy your API key (starts with `AIza...`)

### 3. Configure Environment

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Gemini API (FREE!)
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 How It Works

1. **Enter a lesson outline** - e.g., "A 10 question quiz on Florida"
2. **AI generates TypeScript/React component** - Using Google Gemini
3. **Real-time updates** - See generation status live
4. **View interactive lesson** - The generated component runs in your browser

## 🎯 Example Prompts

- "A 10 question pop quiz on Florida"
- "A one-pager on how to divide with long division"
- "An explanation of how the Cartesian Grid works"
- "A test on counting numbers"

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.0 Flash
- **Real-time**: Supabase Subscriptions
- **Styling**: Tailwind CSS

## 🔒 Safety Features

- Generated code is sandboxed in iframes
- No external API calls allowed in lessons
- TypeScript validation before execution
- Error boundaries for graceful failures

## 📂 Project Structure

```
├── app/
│   ├── api/lessons/      # API routes
│   ├── lessons/[id]/      # Lesson viewer page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/
│   ├── ai/               # AI generation logic
│   ├── db/               # Database queries
│   └── compiler/         # TypeScript runtime
└── types/                # TypeScript types
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Deploy to Supabase

Your database is already hosted on Supabase cloud.

## 🛠️ Development

### Testing without AI

The app works with mock lessons when no API key is configured. This is useful for testing the UI and database functionality.

### Adding New Lesson Types

Edit `lib/ai/prompts.ts` to customize the AI prompts for different lesson types.

## 📄 License

MIT