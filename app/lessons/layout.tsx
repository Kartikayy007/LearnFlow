'use client';

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from '@/components/sidebar';
import {
  IconHome,
  IconList,
} from '@tabler/icons-react';
import { StaggeredMenu } from '@/components/staggered-menu';

const links = [
  {
    label: 'Home',
    href: '/',
    icon: <IconHome className="text-secondary-foreground dark:text-primary-foreground h-5 w-5 flex-shrink-0" />,
  },
  {
    label: 'All Lessons',
    href: '/test',
    icon: <IconList className="text-secondary-foreground dark:text-primary-foreground h-5 w-5 flex-shrink-0" />,
  },
];

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StaggeredMenu />
      <div className="flex h-screen w-full bg-primary">
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
        {children}
      </div>
    </>
  );
}
