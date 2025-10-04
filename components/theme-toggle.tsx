'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-2">
      <span className="text-sm font-medium text-secondary-foreground dark:text-primary-foreground">
        Dark Mode
      </span>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-secondary-foreground dark:text-primary-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-secondary-foreground dark:text-primary-foreground" />
        )}
      </button>
    </div>
  );
}