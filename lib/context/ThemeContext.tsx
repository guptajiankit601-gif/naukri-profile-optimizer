'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export type InterfaceDensity = 'comfortable' | 'compact';
export type TextSize = 'default' | 'large';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  density: InterfaceDensity;
  textSize: TextSize;
  reducedMotion: boolean;
  setTheme: (theme: Theme) => void;
  setDensity: (density: InterfaceDensity) => void;
  setTextSize: (size: TextSize) => void;
  setReducedMotion: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'careerup:theme';
const DENSITY_STORAGE_KEY = 'careerup:density';
const TEXT_SIZE_STORAGE_KEY = 'careerup:text-size';
const REDUCED_MOTION_STORAGE_KEY = 'careerup:reduced-motion';

const LEGACY_THEME_STORAGE_KEY = 'careerlens:theme';
const LEGACY_DENSITY_STORAGE_KEY = 'careerlens:density';
const LEGACY_TEXT_SIZE_STORAGE_KEY = 'careerlens:text-size';
const LEGACY_REDUCED_MOTION_STORAGE_KEY = 'careerlens:reduced-motion';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [density, setDensityState] = useState<InterfaceDensity>('comfortable');
  const [textSize, setTextSizeState] = useState<TextSize>('default');
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY)) as Theme | null;
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        setThemeState(storedTheme);
      }

      const storedDensity = (localStorage.getItem(DENSITY_STORAGE_KEY) || localStorage.getItem(LEGACY_DENSITY_STORAGE_KEY)) as InterfaceDensity | null;
      if (storedDensity === 'comfortable' || storedDensity === 'compact') {
        setDensityState(storedDensity);
      }

      const storedTextSize = (localStorage.getItem(TEXT_SIZE_STORAGE_KEY) || localStorage.getItem(LEGACY_TEXT_SIZE_STORAGE_KEY)) as TextSize | null;
      if (storedTextSize === 'default' || storedTextSize === 'large') {
        setTextSizeState(storedTextSize);
      }

      const storedMotion = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY) || localStorage.getItem(LEGACY_REDUCED_MOTION_STORAGE_KEY);
      if (storedMotion !== null) {
        setReducedMotionState(storedMotion === 'true');
      } else if (typeof window !== 'undefined') {
        setReducedMotionState(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      }
    } catch {
      // localStorage unavailable; use default
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && mediaQuery.matches);

      const resolved = isDark ? 'dark' : 'light';
      setResolvedTheme(resolved);

      const root = document.documentElement;
      if (resolved === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      // Density
      root.classList.toggle('density-compact', density === 'compact');

      // Text Size
      root.classList.toggle('text-large', textSize === 'large');

      // Reduced Motion
      root.classList.toggle('reduced-motion', reducedMotion);
    };

    applyTheme();

    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
      return () => mediaQuery.removeListener(handleSystemChange);
    }
  }, [theme, density, textSize, reducedMotion, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      localStorage.setItem(LEGACY_THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  };

  const setDensity = (newDensity: InterfaceDensity) => {
    setDensityState(newDensity);
    try {
      localStorage.setItem(DENSITY_STORAGE_KEY, newDensity);
      localStorage.setItem(LEGACY_DENSITY_STORAGE_KEY, newDensity);
    } catch {
      // ignore
    }
  };

  const setTextSize = (newSize: TextSize) => {
    setTextSizeState(newSize);
    try {
      localStorage.setItem(TEXT_SIZE_STORAGE_KEY, newSize);
      localStorage.setItem(LEGACY_TEXT_SIZE_STORAGE_KEY, newSize);
    } catch {
      // ignore
    }
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    try {
      localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, String(enabled));
      localStorage.setItem(LEGACY_REDUCED_MOTION_STORAGE_KEY, String(enabled));
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme, 
      density, 
      textSize, 
      reducedMotion,
      setTheme, 
      setDensity, 
      setTextSize, 
      setReducedMotion 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
