'use client';

import { StaggeredMenu } from '@/components/staggered-menu';
import Aurora from '@/components/ui/Aurora';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [colors, setColors] = useState(['#333333', '#ffffff', '#333333']);

  useEffect(() => {
    // Convert HSL to hex
    const hslToHex = (hsl: string) => {
      const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
      const hue = h / 360;
      const sat = s / 100;
      const light = l / 100;

      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
      const p = 2 * light - q;
      const r = Math.round(hue2rgb(p, q, hue + 1/3) * 255);
      const g = Math.round(hue2rgb(p, q, hue) * 255);
      const b = Math.round(hue2rgb(p, q, hue - 1/3) * 255);

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const updateColors = () => {
      const root = document.documentElement;
      const primary = getComputedStyle(root).getPropertyValue('--primary').trim();
      const secondary = getComputedStyle(root).getPropertyValue('--secondary').trim();
      const foreground = getComputedStyle(root).getPropertyValue('--foreground').trim();

      if (primary && secondary && foreground) {
        setColors([
          hslToHex(primary),
          hslToHex(secondary),
          hslToHex(foreground)
        ]);
      }
    };

    // Initial update
    updateColors();

    // Watch for style changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <StaggeredMenu />
      <div className="relative min-h-screen w-full">
        <div className="absolute inset-0 w-full h-full z-0">
          <Aurora
            colorStops={colors}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>
        <div className="relative z-10 p-10 max-w-4xl mx-auto w-full">
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
      </div>
    </>
  );
}