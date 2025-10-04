'use client';

import { useState, useEffect } from 'react';
import Aurora from '@/components/ui/Aurora';
import GradualBlur from '@/components/GradualBlur';
import { LessonHero } from '@/components/lesson/LessonHero';
import { LessonPrompt } from '@/components/lesson/LessonPrompt';
import { LessonExplore } from '@/components/lesson/LessonExplore';
import { YourLessons } from '@/components/lesson/YourLessons';
import { StaggeredMenu } from '@/components/staggered-menu';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/sidebar';
import { IconHome, IconPlus, IconList } from '@tabler/icons-react';

const links = [
  { label: 'Home', href: '/', icon: <IconHome className="h-5 w-5" /> },
  { label: 'All Lessons', href: '/test', icon: <IconList className="h-5 w-5" /> },
];

export default function HomePage() {
  const [colors, setColors] = useState(['#333333', '#ffffff', '#333333']);
  const [input, setInput] = useState('');

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

  return (
    <div className="bg-primary">
      <StaggeredMenu />
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarBody>
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
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
