'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlurText from '@/components/ui/BlurText';
import { Loader } from '@/components/ui/shadcn-io/ai/loader';
import ShinyText from '@/components/ui/ShinyText';
import FuzzyText from '@/components/FuzzyText';
import Galaxy from '@/components/Galaxy';
import FaultyTerminal from '@/components/FaultyTerminal';
import PrismaticBurst from '@/components/PrismaticBurst';
import DotGrid from '../../../components/DotGrid';

interface Lesson {
  id: string;
  title: string;
  outline: string;
  status: 'generating' | 'generated' | 'failed';
  content?: string;
  error_message?: string;
}

const topicData: Record<string, { title: string; cards: Array<{ title: string; src: string; lessonId: string; outline: string; status: 'generated'; created_at: string }> }> = {
  'computer-programming': {
    title: 'Computer Programming',
    cards: [
      {
        title: 'Python Basics',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/800px-Python-logo-notext.svg.png',
        lessonId: '5ba67943-c1f5-4915-acfb-e1bcecadb746',
        outline: 'Learn Python fundamentals with interactive examples',
        status: 'generated',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        title: 'Web Development',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/800px-HTML5_logo_and_wordmark.svg.png',
        lessonId: '451a4124-e0ec-44b9-a528-5e307e3d9d98',
        outline: 'Build modern web applications with HTML, CSS & JavaScript',
        status: 'generated',
        created_at: '2024-01-14T10:00:00Z'
      },
      {
        title: 'Data Structures',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Data_structures_and_algorithms.jpg/800px-Data_structures_and_algorithms.jpg',
        lessonId: '0ffcbe62-1fe8-4b96-9d36-4d346e8a3e74',
        outline: 'Master essential data structures and algorithms',
        status: 'generated',
        created_at: '2024-01-13T10:00:00Z'
      }
    ]
  },
  'science': {
    title: 'Science',
    cards: [
      {
        title: 'Chemistry',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Chemicals_in_flasks.jpg/800px-Chemicals_in_flasks.jpg',
        lessonId: '43cbf96f-4c73-49f9-bada-41143b0a81a5',
        outline: 'Explore chemical reactions and molecular structures',
        status: 'generated',
        created_at: '2024-01-12T10:00:00Z'
      },
      {
        title: 'Biology',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/DNA_Structure%2BKey%2BLabelled.pn_NoBB.png/800px-DNA_Structure%2BKey%2BLabelled.pn_NoBB.png',
        lessonId: '99f3f61f-4d34-41b1-8db3-e6eb01eb6ed6',
        outline: 'Discover the building blocks of life and cellular processes',
        status: 'generated',
        created_at: '2024-01-11T10:00:00Z'
      },
      {
        title: 'Earth Science',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/800px-The_Earth_seen_from_Apollo_17.jpg',
        lessonId: 'd79394ae-d732-4d1e-b165-3ac4c75036b1',
        outline: 'Study our planet\'s geology, atmosphere, and climate',
        status: 'generated',
        created_at: '2024-01-10T10:00:00Z'
      }
    ]
  },
  'physics': {
    title: 'Physics',
    cards: [
      {
        title: 'Quantum Mechanics',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hydrogen_Density_Plots.png/800px-Hydrogen_Density_Plots.png',
        lessonId: 'c6c01f47-4688-44b0-b8b0-00421baea11a',
        outline: 'Dive into the quantum world of particles and waves',
        status: 'generated',
        created_at: '2024-01-09T10:00:00Z'
      },
      {
        title: 'Classical Mechanics',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Newtons_laws_in_latin.jpg/800px-Newtons_laws_in_latin.jpg',
        lessonId: '05b985c9-7f51-4043-8e2f-4e5c424a1d74',
        outline: 'Understand motion, forces, and Newton\'s laws',
        status: 'generated',
        created_at: '2024-01-08T10:00:00Z'
      },
      {
        title: 'Thermodynamics',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Carnot_heat_engine_2.svg/800px-Carnot_heat_engine_2.svg.png',
        lessonId: '3af74700-9506-473e-8fd2-7a6be01fb16b',
        outline: 'Learn about energy, heat, and the laws of thermodynamics',
        status: 'generated',
        created_at: '2024-01-07T10:00:00Z'
      }
    ]
  }
};

export default function LessonViewPage() {
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [jsCode, setJsCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [transpiling, setTranspiling] = useState(false);
  const [error, setError] = useState('');

  const topic = topicData[lessonId];

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

  useEffect(() => {
    if (!topic) {
      fetchLesson();
    } else {
      setLoading(false);
    }
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

    // Properly encode UTF-8 string to base64
    const encodedCode = btoa(unescape(encodeURIComponent(jsCode)));

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
              const jsCode = decodeURIComponent(escape(atob(encodedCode)));
              eval(jsCode);
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(LessonComponent));
            } catch (err) {
              document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;"><h3>❌ Error in Generated Code:</h3><p><strong>' + err.message + '</strong></p><p style="color: #666; font-size: 0.9em;">Try regenerating this lesson with a clearer prompt.</p></div>';
            }
          </script>
        </body>
      </html>
    `;
  };

  const renderBackground = () => {
    if (lessonId === 'science') {
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative', opacity: 0.3 }}>
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1.5}
            glowIntensity={0.5}
            saturation={0.8}
            hueShift={240}
          />
        </div>
      );
    }

    if (lessonId === 'computer-programming') {
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative', opacity: 0.1 }}>
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={1}
            pause={false}
            scanlineIntensity={1}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0}
            tint="#ffffff"
            mouseReact={true}
            mouseStrength={0.5}
            pageLoadAnimation={false}
            brightness={1}
          />
        </div>
      );
    }

    if (lessonId === 'physics') {
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative', opacity: 0.3 }}>
          <DotGrid
            dotSize={10}
            gap={15}
            baseColor="#5227FF"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
      );
    }



    return null;
  };

  if (topic) {
    return (
      <div className="p-4 md:p-10 bg-background rounded-l-3xl border-l-[1px] border-l-border rounded-bl-3xl relative h-full">
        <div className="absolute inset-0 pointer-events-none">
          {renderBackground()}
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
          <BlurText
            text={topic.title}
            delay={70}
            animateBy="words"
            direction="bottom"
            className="text-3xl md:text-5xl font-bold mb-6 md:mb-10 text-foreground text-center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl w-full px-4 md:px-0">
            {topic.cards.map((card) => (
              <Link key={card.title} href={`/lessons/${card.lessonId}`}>
                <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                      {card.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(card.status)}`}>
                      {card.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {card.outline}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(card.created_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-background rounded-l-3xl border-l-[1px] border-l-border rounded-bl-3xl h-full">
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
          <Loader size={48} />
          <h1 className='bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer'>
            Please wait...
          </h1>
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {lesson && (
        <>
          {lesson.status === 'generating' && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
              <Loader size={48} />
              <h1 className='bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer'>
                Generating your lesson...
              </h1>
            </div>
          )}

          {lesson.status === 'failed' && (
            <div className="flex items-center justify-center min-h-[70vh]">
              <FuzzyText
                fontSize="2rem"
                color="#ffff"
                baseIntensity={0.1}
                hoverIntensity={0.2}
              >
                {lesson.error_message || 'Failed to generate lesson'}
              </FuzzyText>
            </div>
          )}

          {lesson.status === 'generated' && (
            <>
              <BlurText
                text={lesson.title}
                delay={100}
                animateBy="words"
                direction="bottom"
                className="text-3xl md:text-5xl font-bold mb-2 text-foreground"
              />

              <p className="text-muted-foreground mb-6 italic">&ldquo;{lesson.outline}&rdquo;</p>

              {lesson.content && (
                <>
                  {transpiling && (
                    <div className="text-gray-500 mb-4">Please wait...</div>
                  )}

                  {jsCode && (
                    <div className="overflow-hidden mt-6 mb-12">
                      <iframe
                        srcDoc={getIframeContent()}
                        className="w-full h-[100vh] mb-12 bg-transparent"
                        title="Lesson Content"
                        sandbox="allow-scripts"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
