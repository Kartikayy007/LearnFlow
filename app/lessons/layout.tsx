'use client';

import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from '@/components/sidebar';
import {
  IconHome,
  IconList,
  IconBrandGithub,
} from '@tabler/icons-react';
import { StaggeredMenu } from '@/components/staggered-menu';
import { useRouter } from 'next/navigation';

const links = [
  {
    label: 'Home',
    href: '/',
    icon: <IconHome className="h-5 w-5" />,
  },
  {
    label: 'All Lessons',
    href: '/test',
    icon: <IconList className="h-5 w-5" />,
  },
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
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-2">
        {links.map((link, idx) => (
          <SidebarLink key={idx} link={link} />
        ))}
      </div>

      {recentLessons.length > 0 && (
        <>
          <div className="border-t border-border my-4"></div>
          <div className="flex flex-col gap-2">
            {open && <p className="text-xs text-muted-foreground px-2 mb-2">Recent Lessons</p>}
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

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);

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
    <>
      <StaggeredMenu />
      <div className="flex h-screen w-full bg-primary">
        <Sidebar>
          <SidebarBody>
            <SidebarContent recentLessons={recentLessons} />
          </SidebarBody>
        </Sidebar>
        {children}
      </div>
    </>
  );
}
