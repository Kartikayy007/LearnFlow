'use client';

import { useParams } from 'next/navigation';
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
import { StaggeredMenu } from '@/components/staggered-menu';

export default function LessonViewPage() {
  const params = useParams();
  const lessonId = params.id as string;

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
    <>
      <StaggeredMenu />
      <div className="flex h-screen">
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

      <div className="flex-1 overflow-auto p-10 rounded-tl-2xl bg-background">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Lesson Viewer
        </h1>

        <p className="text-lg text-muted-foreground mb-4">
          Viewing lesson ID: <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-muted-foreground">
            {lessonId}
          </code>
        </p>

        <div className="border-2 border-dashed border-border rounded-lg p-10 text-center bg-card mt-8">
          <p className="text-muted-foreground">
            Lesson content will be rendered here
          </p>
        </div>
      </div>
    </div>
    </>
  );
}