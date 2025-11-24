'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or default to system
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    
    // Set initial resolved theme immediately (before mount)
    let initialTheme: 'light' | 'dark';
    if (savedTheme === 'system') {
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      initialTheme = savedTheme;
    }
    
    // Apply theme immediately to prevent flash
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);
    
    setThemeState(savedTheme);
    setResolvedTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let effectiveTheme: 'light' | 'dark';

    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      effectiveTheme = theme;
    }

    setResolvedTheme(effectiveTheme);
    root.classList.add(effectiveTheme);
    localStorage.setItem('theme', theme);
    
    // Force a repaint to ensure styles update
    root.style.display = 'none';
    root.offsetHeight; // Trigger reflow
    root.style.display = '';
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system' || !mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const effectiveTheme = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(effectiveTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(effectiveTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((current) => {
      // If currently system, toggle based on resolved theme
      if (current === 'system') {
        return resolvedTheme === 'light' ? 'dark' : 'light';
      }
      // Otherwise toggle between light and dark
      return current === 'light' ? 'dark' : 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

