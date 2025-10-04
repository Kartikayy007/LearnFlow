'use client';

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from '@/components/ui/sidebar';
import {
  IconHome,
  IconPlus,
  IconList,
} from '@tabler/icons-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { ColorCustomizer } from '@/components/color-customizer';

export default function CreateLessonPage() {
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
    <div className="flex h-screen rounded-tl-3xl bg-secondary dark:bg-primary rounded-bl-3xl">
      <Sidebar
      >
        <SidebarBody>
          <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col gap-4">
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pb-4">
              <div className="border-t border-border pt-4">
                <ThemeToggle />
              </div>
              <div className="border-t border-border pt-4">
                <ColorCustomizer />
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 overflow-auto p-10 rounded-tl-3xl bg-background rounded-bl-3xl ">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Create New Lesson
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          This page will allow you to create new lessons
        </p>

        <div className="border-2 border-dashed border-border rounded-lg p-10 text-center bg-card">
          <p className="text-muted-foreground">
            Lesson creation form will go here
          </p>

          {/* Test buttons to show theme colors */}
          <div className="flex gap-4 justify-center mt-6">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-opacity">
              Secondary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}