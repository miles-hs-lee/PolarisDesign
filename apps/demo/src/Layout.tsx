import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ToastProvider, ToastViewport, TooltipProvider, Button, Badge, cn } from '@polaris/ui';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/components', label: 'Components' },
  { to: '/crm/contract', label: 'CRM 예시' },
  { to: '/sign/contracts', label: 'Sign 예시' },
] as const;

export function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('polaris-demo-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('polaris-demo-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const swatchHref = `${import.meta.env.BASE_URL}swatches.html`;

  return (
    <TooltipProvider delayDuration={200}>
    <ToastProvider swipeDirection="right">
      <div className="min-h-screen bg-surface-canvas text-text-primary font-polaris">
        <header className="sticky top-0 z-30 bg-surface-raised/90 backdrop-blur border-b border-surface-border">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2 shrink-0">
              <span className="inline-flex h-7 w-7 rounded-polaris-md bg-brand-primary text-text-on-brand items-center justify-center text-polaris-caption font-bold">P</span>
              <span className="text-polaris-heading-sm font-semibold">Polaris UI</span>
              <Badge variant="secondary" className="hidden sm:inline-flex">Demo</Badge>
            </NavLink>
            <nav className="flex items-center gap-1 flex-1 overflow-x-auto">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-1.5 rounded-polaris-md text-polaris-body-sm font-medium whitespace-nowrap',
                      'text-text-secondary hover:bg-brand-primary-subtle hover:text-text-primary',
                      isActive && 'bg-brand-primary-subtle text-brand-primary'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={swatchHref}
                className="px-3 py-1.5 rounded-polaris-md text-polaris-body-sm font-medium text-text-secondary hover:bg-brand-primary-subtle hover:text-text-primary whitespace-nowrap"
              >
                Tokens
              </a>
            </nav>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
            </Button>
          </div>
        </header>

        <main>
          <Outlet />
        </main>

        <footer className="border-t border-surface-border mt-16">
          <div className="max-w-6xl mx-auto px-6 py-8 text-polaris-caption text-text-muted flex flex-wrap items-center justify-between gap-3">
            <div>Polaris Design System · v0.0.1</div>
            <a
              href="https://github.com/miles-hs-lee/PolarisDesign"
              className="text-brand-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              github.com/miles-hs-lee/PolarisDesign
            </a>
          </div>
        </footer>

        <ToastViewport />
      </div>
    </ToastProvider>
    </TooltipProvider>
  );
}
