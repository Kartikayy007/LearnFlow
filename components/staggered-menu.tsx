'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Palette } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { ColorCustomizer } from '@/components/color-customizer';

export function StaggeredMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Show overlay with fade in
      gsap.to(overlayRef.current, {
        visibility: 'visible',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Animate menu container with scale and slide
      gsap.fromTo(
        menuRef.current,
        {
          x: '100%',
          scale: 0.95,
        },
        {
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: 'expo.out',
        }
      );

      // Stagger animate menu items with more dramatic effect
      gsap.fromTo(
        itemsRef.current,
        {
          x: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      );
    } else {
      // Hide overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlayRef.current, { visibility: 'hidden' });
        },
      });

      // Hide menu with scale and slide
      gsap.to(menuRef.current, {
        x: '100%',
        scale: 0.95,
        duration: 0.4,
        ease: 'power3.in',
      });

      // Reset items
      gsap.set(itemsRef.current, {
        x: 100,
        opacity: 0,
        scale: 0.8,
      });
    }
  }, [isOpen]);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-lg transition-all duration-300 shadow-lg ${
          isOpen
            ? 'bg-background dark:text-white text-black border border-border'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        }`}
        aria-label="Toggle theme menu"
      >
        <Palette
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 invisible opacity-0"
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Container */}
      <div
        ref={menuRef}
        className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-background via-background to-background/95 border-l border-border z-40 transform translate-x-full overflow-y-auto shadow-2xl"
        style={{ willChange: 'transform', transformOrigin: 'right center' }}
      >
        <div className="p-6 pt-20">
          {/* Menu Title */}
          <div ref={addToRefs} className="mb-8">
            <h2 className="text-2xl font-bold dark:text-white text-gray-900">Theme Settings</h2>
            <p className="text-sm dark:text-gray-400 text-gray-600 mt-1">
              Customize your app appearance
            </p>
          </div>

          {/* Theme Toggle Section */}
          <div ref={addToRefs} className="mb-8">
            <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">
              Appearance
            </h3>
            <div className="bg-card rounded-lg p-4 border border-border">
              <ThemeToggle />
            </div>
          </div>

          {/* Color Customizer Section */}
          <div ref={addToRefs} className="mb-8">
            <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">
              Color Scheme
            </h3>
            <div className="bg-card rounded-lg p-4 border border-border">
              <ColorCustomizer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}