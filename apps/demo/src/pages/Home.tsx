import { Link } from 'react-router-dom';
import { Card, CardBody, Badge } from '@polaris/ui';
import { Layers, FileText, Mail, Palette, ArrowRight } from 'lucide-react';

const CARDS = [
  {
    to: '/components',
    icon: Layers,
    title: 'Tier 0 Components',
    desc: '12개 핵심 컴포넌트(Button, Input, Card, Dialog, Toast, Tabs, FileIcon/Card, NovaInput 등)의 모든 variant',
    badge: '컴포넌트 카탈로그',
  },
  {
    to: '/crm/contract',
    icon: FileText,
    title: '폴라리스 영업관리 — 계약 상세',
    desc: '실제 CRM 화면을 폴라리스 토큰만으로 구성한 사례. 상태 타임라인, 결재, 첨부 파일까지',
    badge: '예시 1',
  },
  {
    to: '/sign/contracts',
    icon: Mail,
    title: '폴라리스 사인 — 계약서 목록',
    desc: '전자계약 SaaS의 계약서 관리 화면. 필터·진행률·서명자 표시까지 토큰 기반으로 구현',
    badge: '예시 2',
  },
] as const;

export default function Home() {
  const swatchHref = `${import.meta.env.BASE_URL}swatches.html`;
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section className="mb-12">
        <Badge variant="secondary" className="mb-4">v0.0.1 · Tier 0</Badge>
        <h1 className="text-polaris-display-md mb-3">
          Polaris Design System
        </h1>
        <p className="text-polaris-body-lg text-text-secondary max-w-2xl">
          바이브코딩옵스로 만들어지는 폴라리스 웹 서비스들의 디자인을 일관되게 만드는 시스템.
          토큰·컴포넌트·린트·Claude Code 플러그인까지 묶어서 모델이 우회 못하게 하는 게 목표.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.to} to={card.to} className="group">
              <Card className="h-full transition-colors hover:border-brand-primary group-focus-visible:ring-2 group-focus-visible:ring-brand-primary">
                <CardBody>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-polaris-md bg-brand-primary-subtle text-brand-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <Badge variant="neutral">{card.badge}</Badge>
                  </div>
                  <h3 className="text-polaris-heading-sm mb-1.5">{card.title}</h3>
                  <p className="text-polaris-body-sm text-text-secondary mb-4">{card.desc}</p>
                  <span className="inline-flex items-center gap-1 text-polaris-body-sm text-brand-primary">
                    살펴보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href={swatchHref} className="group">
          <Card className="h-full transition-colors hover:border-brand-primary">
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-polaris-md bg-brand-secondary-subtle text-brand-secondary">
                  <Palette className="h-5 w-5" aria-hidden="true" />
                </span>
                <Badge variant="secondary">Tokens v0.1</Badge>
              </div>
              <h3 className="text-polaris-heading-sm mb-1.5">디자인 토큰 스와치</h3>
              <p className="text-polaris-body-sm text-text-secondary mb-4">
                4색 브랜드 팔레트(파랑·초록·주황·빨강)와 NOVA 보라, 시맨틱 상태 컬러, 뉴트럴 12단계, 타이포·반경·그림자까지 한 페이지에서.
              </p>
              <span className="inline-flex items-center gap-1 text-polaris-body-sm text-brand-secondary">
                토큰 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </CardBody>
          </Card>
        </a>

        <Card>
          <CardBody>
            <h3 className="text-polaris-heading-sm mb-3">아키텍처</h3>
            <ul className="text-polaris-body-sm text-text-secondary space-y-2">
              <li>
                <code className="text-text-primary font-polaris-mono">@polaris/ui</code> — TS 토큰 + CSS 변수 + Tailwind preset + 12개 컴포넌트
              </li>
              <li>
                <code className="text-text-primary font-polaris-mono">@polaris/lint</code> — hex/임의값/직접 font-family 차단 ESLint 룰
              </li>
              <li>
                <code className="text-text-primary font-polaris-mono">polaris-design</code> — Claude Code 플러그인 (skill, slash 커맨드, PostToolUse 훅)
              </li>
            </ul>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
