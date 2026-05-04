'use client';

import { useEffect, useState } from 'react';
import { Button } from '@polaris/ui';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
    </Button>
  );
}
