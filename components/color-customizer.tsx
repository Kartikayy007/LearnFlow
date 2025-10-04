'use client';

import { useEffect, useState } from 'react';
import { colorPresets } from '@/lib/theme/presets';

export function ColorCustomizer() {
  const [colors, setColors] = useState({
    primary: '#333333',
    primaryForeground: '#ffffff',
    secondary: '#ffffff',
    secondaryForeground: '#000000',
    background: '#000000',
    foreground: '#ffffff',
    border: '#333333',
  });

  // Load saved colors on mount or apply defaults
  useEffect(() => {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      const parsed = JSON.parse(savedColors);
      // Ensure all properties exist, use defaults for missing ones
      const completeColors = {
        primary: parsed.primary || '#333333',
        primaryForeground: parsed.primaryForeground || '#ffffff',
        secondary: parsed.secondary || '#ffffff',
        secondaryForeground: parsed.secondaryForeground || '#000000',
        background: parsed.background || '#000000',
        foreground: parsed.foreground || '#ffffff',
        border: parsed.border || '#333333',
      };
      setColors(completeColors);
      applyColors(completeColors);
    } else {
      // No saved colors, apply the default colors
      const defaultColors = {
        primary: '#333333',
        primaryForeground: '#ffffff',
        secondary: '#ffffff',
        secondaryForeground: '#000000',
        background: '#000000',
        foreground: '#ffffff',
        border: '#333333',
      };
      applyColors(defaultColors);
    }
  }, []);

  
  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) {
      return `0 0% ${(l * 100).toFixed(1)}%`;
    }

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h = 0;
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h /= 6;

    return `${(h * 360).toFixed(0)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
  };

  const applyColors = (colorValues: typeof colors) => {
    const root = document.documentElement;

    if (colorValues.primary) root.style.setProperty('--primary', hexToHSL(colorValues.primary));
    if (colorValues.primaryForeground) root.style.setProperty('--primary-foreground', hexToHSL(colorValues.primaryForeground));
    if (colorValues.secondary) root.style.setProperty('--secondary', hexToHSL(colorValues.secondary));
    if (colorValues.secondaryForeground) root.style.setProperty('--secondary-foreground', hexToHSL(colorValues.secondaryForeground));
    if (colorValues.background) root.style.setProperty('--background', hexToHSL(colorValues.background));
    if (colorValues.foreground) root.style.setProperty('--foreground', hexToHSL(colorValues.foreground));
    if (colorValues.border) root.style.setProperty('--border', hexToHSL(colorValues.border));
  };

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    const newColors = { ...colors, [colorKey]: value };
    setColors(newColors);
    localStorage.setItem('customColors', JSON.stringify(newColors));
    applyColors(newColors);
  };

  const resetColors = () => {
    const defaultColors = {
      primary: '#333333',
      primaryForeground: '#ffffff',
      secondary: '#ffffff',
      secondaryForeground: '#000000',
      background: '#000000',
      foreground: '#ffffff',
      border: '#333333',
    };
    setColors(defaultColors);
    localStorage.removeItem('customColors');

    applyColors(defaultColors);
  };

  const randomizeColors = () => {
    const randomPreset = colorPresets[Math.floor(Math.random() * colorPresets.length)];
    setColors(randomPreset.colors);
    localStorage.setItem('customColors', JSON.stringify(randomPreset.colors));
    applyColors(randomPreset.colors);
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setColors(preset.colors);
    localStorage.setItem('customColors', JSON.stringify(preset.colors));
    applyColors(preset.colors);
  };

  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="text-sm font-medium text-gray-300">
        Theme Colors
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Primary</label>
          <input
            type="color"
            value={colors.primary}
            onChange={(e) => handleColorChange('primary', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Primary Text</label>
          <input
            type="color"
            value={colors.primaryForeground}
            onChange={(e) => handleColorChange('primaryForeground', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Secondary</label>
          <input
            type="color"
            value={colors.secondary}
            onChange={(e) => handleColorChange('secondary', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Secondary Text</label>
          <input
            type="color"
            value={colors.secondaryForeground}
            onChange={(e) => handleColorChange('secondaryForeground', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Background</label>
          <input
            type="color"
            value={colors.background}
            onChange={(e) => handleColorChange('background', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Text</label>
          <input
            type="color"
            value={colors.foreground}
            onChange={(e) => handleColorChange('foreground', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Border</label>
          <input
            type="color"
            value={colors.border}
            onChange={(e) => handleColorChange('border', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <select
          onChange={(e) => {
            const preset = colorPresets.find(p => p.name === e.target.value);
            if (preset) applyPreset(preset);
          }}
          className="w-full text-xs bg-background dark:text-white text-gray-900 border border-border rounded px-2 py-1.5 hover:bg-muted transition-colors cursor-pointer"
        >
          <option value="">Choose a preset theme...</option>
          {colorPresets.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={randomizeColors}
          className="flex-1 text-xs text-gray-400 hover:text-white transition-colors py-1 px-2 border border-border rounded hover:bg-muted"
        >
          🎲 Randomize
        </button>
        <button
          onClick={resetColors}
          className="flex-1 text-xs text-gray-400 hover:text-white transition-colors py-1 px-2 border border-border rounded hover:bg-muted"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}