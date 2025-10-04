'use client';

import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from '@/components/sidebar';
import {
  IconHome,
  IconPlus,
  IconList,
} from '@tabler/icons-react';
import { StaggeredMenu } from '@/components/staggered-menu';
import Aurora from '@/components/ui/Aurora';
import RotatingText from '../../components/RotatingText';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { FocusCards } from "@/components/ui/focus-cards";
import GradualBlurMemo from '@/components/GradualBlur';
import GradualBlur from '@/components/GradualBlur';

export default function CreateLessonPage() {
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
  const links = [
    {
      label: 'Home',
      href: '/',
      icon: <IconHome className="text-secondary-foreground dark:text-primary-foreground h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Create Lesson',
      href: '/lesson',
      icon: <IconPlus className="text-secondary-foreground dark:text-primary-foreground h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'All Lessons',
      href: '/test',
      icon: <IconList className="text-secondary-foreground dark:text-primary-foreground h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <div className='overflow-x-hidden'>
      <StaggeredMenu />
      <div className="flex h-screen w-full rounded-tl-3xl bg-secondary dark:bg-primary rounded-bl-3xl">
        <Sidebar>
          <SidebarBody>
            <div className="flex flex-col h-full">
              <div className="flex flex-col gap-4">
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        <div className="flex-1 overflow-auto rounded-tl-3xl bg-black border-l-[1px] border-l-border rounded-bl-3xl relative">
          <div className="h-full w-[97vw] overflow-hidden">
            <Aurora
              colorStops={colors}
              blend={1.0}
              amplitude={0.5}
              speed={0.5}
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center space-between p-10 z-10">

            <div className='mb-10 flex flex-col items-center'>
              <div className='flex items-center'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mr-2'>
                  Learn
                </h1>
                <RotatingText
                  texts={['Flow', 'Coding', 'Science', 'Everything', 'Anything']}
                  mainClassName="px-2 sm:px-2 md:px-3 bg-secondary text-secondary-foreground overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg text-3xl sm:text-4xl md:text-5xl font-bold"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={7000}
                />
              </div>

              <p className="text-muted-foreground text-center mt-4 max-w-2xl">
                AI-Powered Interactive Learning Experience
              </p>
            </div>



            <div className="w-full max-w-2xl">
              <PromptInput onSubmit={(e) => { e.preventDefault(); console.log('Submitted:', input); }}>
                <PromptInputTextarea
                  value={input}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  placeholder="What would you like to learn today?"
                />
                <PromptInputToolbar>
                  <PromptInputSubmit disabled={!input.trim()} />
                </PromptInputToolbar>
              </PromptInput>
            </div>

            <div className="w-full mb-8 max-w-5xl mx-auto px-4 md:px-8 mt-10">
              <h1 className='text-2xl md:text-3xl font-semibold mb-6 text-left'>
                Explore:
              </h1>
              <FocusCards cards={[
                {
                  title: "Computer Programming",
                  src: "https://upload.wikimedia.org/wikipedia/commons/0/0c/ENIAC-changing_a_tube_%28cropped%29.jpg"
                },
                {
                  title: "Science",
                  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/960px-ESO-VLT-Laser-phot-33a-07.jpg"
                },
                {
                  title: "Physics",
                  src: "https://upload.wikimedia.org/wikipedia/commons/a/af/Einstein1921_by_F_Schmutzer_2.jpg"
                }
              ]} />


            </div>

            <div>
              
            </div>
          </div>
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
  );
}