'use client';

import { useState, useEffect } from 'react';
import Aurora from '@/components/ui/Aurora';
import GradualBlur from '@/components/GradualBlur';
import { LessonHero } from '@/components/lesson/LessonHero';
import { LessonPrompt } from '@/components/lesson/LessonPrompt';
import { LessonExplore } from '@/components/lesson/LessonExplore';
import { YourLessons } from '@/components/lesson/YourLessons';
import { StaggeredMenu } from '@/components/staggered-menu';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/sidebar';
import { IconHome, IconList } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const links = [
  { label: 'Home', href: '/', icon: <IconHome className="h-5 w-5" /> },
  { label: 'All Lessons', href: '/test', icon: <IconList className="h-5 w-5" /> },
];

interface Lesson {
  id: string;
  title: string;
  status: 'generating' | 'generated' | 'failed';
}

function SidebarContent({ recentLessons }: { recentLessons: Lesson[] }) {
  const { open } = useSidebar();
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'bg-green-500';
      case 'generating':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full font-bold">
      <div className="flex flex-col gap-2">
        {links.map((link, idx) => (
          <SidebarLink key={idx} link={link} />
        ))}
      </div>

      {recentLessons.length > 0 && (
        <>
          <div className="border-t border-border my-4"></div>
          <div className="flex flex-col gap-2">
            {open && <p className="text-xs text-text px-2 mb-2">Recent Lessons</p>}
            {recentLessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => router.push(`/lessons/${lesson.id}`)}
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${getStatusColor(lesson.status)}`}></div>
                {open && (
                  <span className="text-sm text-foreground truncate flex-1">
                    {lesson.title}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  const [colors, setColors] = useState(['#333333', '#ffffff', '#333333']);
  const [input, setInput] = useState('');
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const hslToHex = (hsl: string) => {
      const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
      const hue = h / 360;
      const sat = s / 100;
      const light = l / 100;

      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
      const p = 2 * light - q;
      const r = Math.round(hue2rgb(p, q, hue + 1 / 3) * 255);
      const g = Math.round(hue2rgb(p, q, hue) * 255);
      const b = Math.round(hue2rgb(p, q, hue - 1 / 3) * 255);

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const updateColors = () => {
      const root = document.documentElement;
      const primary = getComputedStyle(root).getPropertyValue('--primary').trim();
      const foreground = getComputedStyle(root).getPropertyValue('--foreground').trim();
      const secondary = getComputedStyle(root).getPropertyValue('--secondary').trim();

      if (primary && secondary && foreground) {
        setColors([
          hslToHex(primary),
          hslToHex(foreground),
          hslToHex(secondary),
        ]);
      }
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchRecentLessons();
  }, []);

  const fetchRecentLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      if (response.ok) {
        const data = await response.json();
        setRecentLessons(data.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch recent lessons', err);
    }
  };

  return (
    <div className="bg-primary">
      <StaggeredMenu />
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarBody>
            <SidebarContent recentLessons={recentLessons} />
          </SidebarBody>
        </Sidebar>

        <div className="flex-1 overflow-auto rounded-l-3xl bg-background border-l-[1px] border-l-border rounded-bl-3xl relative">
          <div className="h-full w-[96.2vw] overflow-hidden scrollbar-hide">
            <Aurora
              colorStops={colors}
              blend={1.0}
              amplitude={0.5}
              speed={0.5}
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center space-between p-10 z-10">
            <LessonHero />
            <LessonPrompt input={input} setInput={setInput} />
            <LessonExplore />
          </div>
          <div className='-mt-32 mb-24'>
            <YourLessons />
          </div>
        </div>

        <GradualBlur
          target="parent"
          position="bottom"
          height="6rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential={true}
          opacity={1}
        />
      </div>
    </div>
  );
}
