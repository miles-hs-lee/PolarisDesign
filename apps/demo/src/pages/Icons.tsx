import { useMemo, useState } from 'react';
import { Input } from '@polaris/ui';
import * as PolarisIcons from '@polaris/ui/icons';
import * as PolarisFileIcons from '@polaris/ui/file-icons';
import { PolarisLogo, NovaLogo } from '@polaris/ui/logos';
import { SearchIcon } from '@polaris/ui/icons';

/**
 * Icon catalog page — visual reference for the design-team SVG set
 * shipped via @polaris/ui/icons, /file-icons, /logos.
 *
 * Three sections:
 *   1. UI icons       — 65 monochrome icons × 3 sizes (18/24/32)
 *   2. File icons     — 29 multi-color file-type icons
 *   3. Logos          — Polaris Office (3 variants × 2 tones) + Nova (2 tones)
 */
export default function IconsPage() {
  const [query, setQuery] = useState('');

  const uiEntries = useMemo(() => {
    const entries = Object.entries(PolarisIcons)
      .filter(([key, value]) => key.endsWith('Icon') && typeof value === 'object')
      .map(([key, Component]) => ({
        name: key,
        // Convert "ArrowDownIcon" → "arrow-down" for search.
        slug: key
          .replace(/Icon$/, '')
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-/, ''),
        Component: Component as React.ForwardRefExoticComponent<{ size?: number; className?: string }>,
      }));
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) => e.slug.includes(q) || e.name.toLowerCase().includes(q));
  }, [query]);

  const fileEntries = useMemo(() => {
    return Object.entries(PolarisFileIcons.FILE_ICON_REGISTRY).map(([slug, Component]) => ({
      slug,
      Component: Component as React.ForwardRefExoticComponent<{ size?: number }>,
    }));
  }, []);

  return (
    <div className="px-polaris-lg py-polaris-2xl space-y-polaris-3xl">
      <header className="space-y-polaris-2xs">
        <h1 className="text-polaris-title text-label-normal">아이콘 카탈로그</h1>
        <p className="text-polaris-body2 text-label-neutral max-w-2xl">
          디자인팀 Figma에서 export 한 SVG 자산. UI 아이콘은 18 / 24 / 32 px 그리드별로 별도 디자인되어 있고, 빌드 시 React 컴포넌트로 변환된다. 파일 아이콘과 로고는 멀티컬러로 baked-in.
        </p>
      </header>

      <Section title="1. UI Icons" subtitle={`${uiEntries.length} icons · 18 / 24 / 32 px · stroke 색상은 currentColor (Tailwind text-* 로 색 제어)`}>
        <div className="max-w-md mb-polaris-md relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-label-alternative pointer-events-none" />
          <Input
            placeholder="이름으로 검색 (예: arrow, chevron, plus)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-polaris-2xs">
          {uiEntries.map(({ name, slug, Component }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-polaris-2xs p-polaris-sm rounded-polaris-md border border-line-neutral hover:border-line-normal transition-colors text-label-normal"
            >
              <Component size={24} />
              <code className="text-polaris-caption2 text-label-alternative font-polaris-mono break-all text-center">
                {slug}
              </code>
            </div>
          ))}
        </div>
        {uiEntries.length === 0 && (
          <p className="text-polaris-body2 text-label-alternative text-center py-polaris-2xl">
            검색 결과 없음
          </p>
        )}
      </Section>

      <Section title="2. 사이즈별 비교" subtitle="같은 아이콘이 18/24/32 px에서 어떻게 다른지 — 디자이너가 그리드별로 path를 hand-tune">
        <div className="space-y-polaris-md">
          {(['arrow-down', 'check', 'chevron-right', 'search', 'send', 'close'] as const).map((slug) => {
            const components = [18, 24, 32].map((s) => ({ size: s, slug }));
            return (
              <div key={slug} className="flex items-end gap-polaris-md">
                <code className="text-polaris-caption1 text-label-neutral font-polaris-mono w-32">
                  {slug}
                </code>
                {components.map(({ size }) => {
                  const C = uiEntries.find((e) => e.slug === slug)?.Component;
                  return C ? (
                    <div key={size} className="flex flex-col items-center gap-polaris-3xs">
                      <C size={size} className="text-label-normal" />
                      <span className="text-polaris-caption2 text-label-alternative">
                        {size}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="3. File Icons" subtitle={`${fileEntries.length} types · 32 px master · 멀티컬러 baked-in`}>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-polaris-2xs">
          {fileEntries.map(({ slug, Component }) => (
            <div
              key={slug}
              className="flex flex-col items-center gap-polaris-2xs p-polaris-sm rounded-polaris-md border border-line-neutral"
            >
              <Component size={40} />
              <code className="text-polaris-caption2 text-label-alternative font-polaris-mono">
                {slug}
              </code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="4. Logos" subtitle="Polaris Office (3 variants × tones) + Nova (default · white)">
        <div className="space-y-polaris-lg">
          {/* Polaris Office */}
          <div className="space-y-polaris-2xs">
            <h3 className="text-polaris-heading4 text-label-normal">Polaris Office</h3>
            <div className="flex items-end gap-polaris-md flex-wrap p-polaris-md rounded-polaris-md border border-line-neutral">
              <LogoFrame label="horizontal">
                <PolarisLogo variant="horizontal" size={40} />
              </LogoFrame>
              <LogoFrame label="symbol">
                <PolarisLogo variant="symbol" size={64} />
              </LogoFrame>
              <LogoFrame label="favicon">
                <PolarisLogo variant="favicon" size={32} />
              </LogoFrame>
            </div>
            <div className="flex items-end gap-polaris-md flex-wrap p-polaris-md rounded-polaris-md bg-accent-action-normal">
              <LogoFrame label="horizontal-negative" tone="dark">
                <PolarisLogo variant="horizontal" tone="negative" size={40} />
              </LogoFrame>
            </div>
          </div>

          {/* Nova */}
          <div className="space-y-polaris-2xs">
            <h3 className="text-polaris-heading4 text-label-normal">Nova</h3>
            <div className="flex items-end gap-polaris-md flex-wrap p-polaris-md rounded-polaris-md border border-line-neutral">
              <LogoFrame label="default">
                <NovaLogo size={32} />
              </LogoFrame>
            </div>
            <div className="flex items-end gap-polaris-md flex-wrap p-polaris-md rounded-polaris-md bg-ai-normal">
              <LogoFrame label="white" tone="dark">
                <NovaLogo tone="white" size={32} />
              </LogoFrame>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-polaris-md">
      <header className="space-y-polaris-3xs">
        <h2 className="text-polaris-heading2 text-label-normal">{title}</h2>
        <p className="text-polaris-body2 text-label-neutral">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

function LogoFrame({
  label,
  tone = 'light',
  children,
}: {
  label: string;
  tone?: 'light' | 'dark';
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-polaris-3xs">
      {children}
      <code
        className={
          'text-polaris-caption2 font-polaris-mono ' +
          (tone === 'dark' ? 'text-static-white opacity-80' : 'text-label-alternative')
        }
      >
        {label}
      </code>
    </div>
  );
}
