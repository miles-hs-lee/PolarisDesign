/**
 * Temporary design-audit page — side-by-side compares the values in our
 * `tokens.ts` / components against the values in the design team's
 * "Polaris Office Design System v1 (2026.05)" spec PDF.
 *
 * NOT for production. Delete once we've reconciled tokens.ts with the
 * spec (one of v0.7.0 / v0.6.2 release plans).
 *
 * The page intentionally uses raw hex values for the spec swatches —
 * those values aren't in our token system yet, so we can't reference
 * polaris tokens. ESLint rules are disabled at the file level for this.
 */
/* eslint-disable @polaris/no-hardcoded-color, @polaris/prefer-polaris-component, @polaris/no-direct-font-family */
import { Badge, Button, Card, CardBody, Input, cn } from '@polaris/ui';
import {
  brandPalette,
  brand,
  fileType,
  status,
  neutral,
  textStyle,
  radius,
} from '@polaris/ui/tokens';

/* ================================================================== *
 * Compare row primitives
 * ================================================================== */

function SwatchPair({
  label,
  ours,
  spec,
  oursName,
  specName,
}: {
  label: string;
  ours: string;
  spec: string;
  oursName?: string;
  specName?: string;
}) {
  const same = ours.toLowerCase() === spec.toLowerCase();
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3 py-2 border-b border-surface-border last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 shrink-0 rounded-polaris-sm border border-surface-border" style={{ background: ours }} />
        <div className="min-w-0">
          <div className="text-polaris-body-sm font-semibold truncate">{label}</div>
          <code className="text-polaris-caption text-fg-muted font-polaris-mono">{ours}</code>
          {oursName && <div className="text-polaris-caption text-fg-muted">{oursName}</div>}
        </div>
      </div>
      <span className="text-polaris-caption text-fg-muted">vs</span>
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 shrink-0 rounded-polaris-sm border border-surface-border" style={{ background: spec }} />
        <div className="min-w-0">
          <div className="text-polaris-body-sm font-semibold truncate">spec</div>
          <code className="text-polaris-caption text-fg-muted font-polaris-mono">{spec}</code>
          {specName && <div className="text-polaris-caption text-fg-muted">{specName}</div>}
        </div>
      </div>
      <Badge variant={same ? 'success' : 'danger'}>{same ? '일치' : '불일치'}</Badge>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-polaris-heading-md">{title}</h2>
        {subtitle && <p className="text-polaris-body-sm text-fg-secondary">{subtitle}</p>}
      </div>
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </section>
  );
}

/* ================================================================== *
 * Sections
 * ================================================================== */

function BrandColorsSection() {
  return (
    <Section title="1. 브랜드 컬러" subtitle="PO Blue · AI Purple — 정의서 정식값과 비교">
      <SwatchPair
        label="PO Blue (primary)"
        ours={brand.primary.light}
        spec="#1D7FF9"
        oursName="brand.primary"
        specName="primary-normal"
      />
      <SwatchPair
        label="primary hover"
        ours={brand.primaryHover.light}
        spec="#1458AD"
        oursName="brand.primaryHover"
        specName="primary-strong"
      />
      <SwatchPair
        label="AI Purple (secondary)"
        ours={brand.secondary.light}
        spec="#6F3AD0"
        oursName="brand.secondary"
        specName="ai-normal"
      />
      <SwatchPair
        label="AI Purple hover"
        ours={brand.secondaryHover.light}
        spec="#511BB2"
        oursName="brand.secondaryHover"
        specName="ai-strong"
      />
      <SwatchPair
        label="AI hover surface"
        ours={brand.secondarySubtle.light}
        spec="#F5F1FD"
        oursName="brand.secondarySubtle"
        specName="ai-hover"
      />
    </Section>
  );
}

function FormatColorsSection() {
  return (
    <Section title="2. 포맷별 컬러" subtitle="Word / Sheet / Slide / PDF — 파일 카드, 아이콘, 뱃지에 사용">
      <SwatchPair
        label="Word (.docx)"
        ours={fileType.docx.light}
        spec="#1D7FF9"
        oursName="fileType.docx"
      />
      <SwatchPair
        label="Sheet (.xlsx)"
        ours={fileType.xlsx.light}
        spec="#51B41B"
        oursName="fileType.xlsx"
      />
      <SwatchPair
        label="Slide (.pptx)"
        ours={fileType.pptx.light}
        spec="#FD8900"
        oursName="fileType.pptx"
      />
      <SwatchPair
        label="PDF"
        ours={fileType.pdf.light}
        spec="#F95C5C"
        oursName="fileType.pdf"
      />
    </Section>
  );
}

function GrayRampSection() {
  // Spec gray ramp (9 steps, 10 → 90)
  const specRamp: Array<{ step: string; hex: string; use: string }> = [
    { step: '10', hex: '#F7F8F9', use: '대체 배경, 카드 표면, hover' },
    { step: '20', hex: '#F2F4F6', use: '↑' },
    { step: '30', hex: '#E8EBED', use: '기본 라인 (구분선)' },
    { step: '40', hex: '#C9CDD2', use: '인풋 보더, 강한 라인' },
    { step: '50', hex: '#B3B8BD', use: 'placeholder, disabled' },
    { step: '60', hex: '#9EA4AA', use: '↑' },
    { step: '70', hex: '#72787F', use: '3차 라벨, 캡션' },
    { step: '80', hex: '#454C53', use: '본문 (label-neutral)' },
    { step: '90', hex: '#26282B', use: '1차 텍스트 (label-normal)' },
  ];

  // Our 12-step neutral
  const oursRamp = Object.entries(neutral).map(([step, pair]) => ({
    step,
    hex: pair.light,
  }));

  return (
    <Section
      title="3. Gray ramp"
      subtitle={`구조 자체가 다름 — 우리 ${oursRamp.length}단계 vs 정의서 ${specRamp.length}단계`}
    >
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">우리 — neutral.0~1000 (12단계)</div>
          <ul className="space-y-1">
            {oursRamp.map(({ step, hex }) => (
              <li key={step} className="flex items-center gap-2 text-polaris-caption">
                <div className="h-6 w-6 shrink-0 rounded-polaris-sm border border-surface-border" style={{ background: hex }} />
                <code className="font-polaris-mono w-16 text-fg-muted">{step}</code>
                <code className="font-polaris-mono">{hex}</code>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">정의서 — gray-10~90 (9단계)</div>
          <ul className="space-y-1">
            {specRamp.map(({ step, hex, use }) => (
              <li key={step} className="flex items-center gap-2 text-polaris-caption">
                <div className="h-6 w-6 shrink-0 rounded-polaris-sm border border-surface-border" style={{ background: hex }} />
                <code className="font-polaris-mono w-16 text-fg-muted">{step}</code>
                <code className="font-polaris-mono">{hex}</code>
                <span className="text-fg-muted truncate">{use}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function PaletteRampSection() {
  // Side-by-side: our base palette hex vs spec PO Blue ramp
  return (
    <Section title="4. PO Blue ramp" subtitle="정의서는 9단계 ramp(5–80) 정의 — 우리는 단일 hex만">
      <div className="space-y-4">
        <div>
          <div className="text-polaris-body-sm font-semibold mb-1">우리 — brandPalette.blue</div>
          <div className="flex items-center gap-2">
            <div className="h-12 w-32 rounded-polaris-sm border border-surface-border" style={{ background: brandPalette.blue.light }} />
            <code className="font-polaris-mono text-polaris-caption">{brandPalette.blue.light}</code>
          </div>
        </div>
        <div>
          <div className="text-polaris-body-sm font-semibold mb-1">정의서 — PO Blue 9-step ramp</div>
          <div className="flex">
            {[
              { s: '5',  hex: '#E8F2FE' },
              { s: '10', hex: '#D9EAFF' },
              { s: '20', hex: '#BBD8FD' },
              { s: '30', hex: '#8EBFFC' },
              { s: '40', hex: '#60A5FA' },
              { s: '50', hex: '#1D7FF9' },
              { s: '60', hex: '#186CD3' },
              { s: '70', hex: '#1458AD' },
              { s: '80', hex: '#0F4588' },
            ].map(({ s, hex }) => (
              <div key={s} className="flex-1 text-center">
                <div className="h-12 border border-surface-border" style={{ background: hex }} />
                <div className="text-polaris-caption mt-1">
                  <code className="font-polaris-mono">{s}</code>
                  <div className="font-polaris-mono text-fg-muted">{hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function StatusColorsSection() {
  return (
    <Section title="5. 상태 컬러" subtitle="success / warning / danger / info">
      <SwatchPair
        label="status.success"
        ours={status.success.light}
        spec="#16A34A"
      />
      <SwatchPair
        label="status.warning"
        ours={status.warning.light}
        spec="#EAB308"
      />
      <SwatchPair
        label="status.danger"
        ours={status.danger.light}
        spec="#DC2626"
      />
      <SwatchPair
        label="status.info"
        ours={status.info.light}
        spec="#2563EB"
      />
      <p className="text-polaris-caption text-fg-muted mt-2">
        ※ 정의서가 status 컬러를 직접 명시하지는 않음. 위 값은 우리가 사용 중인 값. 정의서의 PDF Red(#F95C5C)와 우리 status.danger(#DC2626)가 다른 점 주의 — 정의서 의도는 "danger 액션 = PDF Red" 가능성.
      </p>
    </Section>
  );
}

function TypographySection() {
  // textStyle keys map roughly to spec H/Body levels
  const samples = '한국어와 영어 텍스트가 함께 — Polaris Office AI';

  type Pair = {
    label: string;
    ours?: { fontSize: string; fontWeight: number; letterSpacing: string };
    spec: { fontSize: string; fontWeight: number; letterSpacing: string };
  };
  const pairs: Pair[] = [
    {
      label: 'Display 60 / displayLg',
      ours: { fontSize: textStyle.displayLg.fontSize, fontWeight: textStyle.displayLg.fontWeight, letterSpacing: textStyle.displayLg.letterSpacing },
      spec: { fontSize: '60px', fontWeight: 700, letterSpacing: '-0.020em' },
    },
    {
      label: 'H1 40 / (없음 in 우리)',
      spec: { fontSize: '40px', fontWeight: 700, letterSpacing: '-0.018em' },
    },
    {
      label: 'H2 32 / (없음)',
      spec: { fontSize: '32px', fontWeight: 700, letterSpacing: '-0.012em' },
    },
    {
      label: 'H3 28 / (없음)',
      spec: { fontSize: '28px', fontWeight: 700, letterSpacing: '-0.010em' },
    },
    {
      label: 'H4 24 / headingLg',
      ours: { fontSize: textStyle.headingLg.fontSize, fontWeight: textStyle.headingLg.fontWeight, letterSpacing: textStyle.headingLg.letterSpacing },
      spec: { fontSize: '24px', fontWeight: 700, letterSpacing: '-0.005em' },
    },
    {
      label: 'H5 20 / headingMd',
      ours: { fontSize: textStyle.headingMd.fontSize, fontWeight: textStyle.headingMd.fontWeight, letterSpacing: textStyle.headingMd.letterSpacing },
      spec: { fontSize: '20px', fontWeight: 700, letterSpacing: '-0.005em' },
    },
    {
      label: 'Body 16 / bodyLg',
      ours: { fontSize: textStyle.bodyLg.fontSize, fontWeight: textStyle.bodyLg.fontWeight, letterSpacing: textStyle.bodyLg.letterSpacing },
      spec: { fontSize: '16px', fontWeight: 400, letterSpacing: '-0.002em' },
    },
  ];

  return (
    <Section title="6. Typography" subtitle="우리의 weight=600(semibold) vs 정의서 weight=700(bold) — 모든 heading">
      <ul className="space-y-4">
        {pairs.map((p) => (
          <li key={p.label} className="space-y-1.5 pb-3 border-b border-surface-border last:border-0">
            <div className="text-polaris-caption font-polaris-mono text-fg-muted">{p.label}</div>
            {p.ours ? (
              <div style={{ fontSize: p.ours.fontSize, fontWeight: p.ours.fontWeight, letterSpacing: p.ours.letterSpacing, lineHeight: 1.2 }}>
                <span className="text-polaris-caption text-fg-muted block mb-0.5 font-polaris-mono" style={{ fontWeight: 400, fontSize: '12px', letterSpacing: 0 }}>
                  ours · {p.ours.fontSize} / {p.ours.fontWeight} / {p.ours.letterSpacing}
                </span>
                {samples}
              </div>
            ) : (
              <div className="text-polaris-caption text-fg-muted italic">우리 시스템에 없음 — 정의서만 정의됨</div>
            )}
            <div style={{ fontSize: p.spec.fontSize, fontWeight: p.spec.fontWeight, letterSpacing: p.spec.letterSpacing, lineHeight: 1.2 }}>
              <span className="text-polaris-caption text-fg-muted block mb-0.5 font-polaris-mono" style={{ fontWeight: 400, fontSize: '12px', letterSpacing: 0 }}>
                spec · {p.spec.fontSize} / {p.spec.fontWeight} / {p.spec.letterSpacing}
              </span>
              {samples}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function RadiusSection() {
  const oursRadius = Object.entries(radius);
  const specRadius: Array<{ key: string; px: string; star?: boolean }> = [
    { key: '2xs', px: '2px' },
    { key: 'xs', px: '4px' },
    { key: 'sm', px: '6px' },
    { key: 'md', px: '8px' },
    { key: 'lg', px: '12px', star: true },
    { key: 'xl', px: '16px' },
    { key: '2xl', px: '24px' },
    { key: 'pill', px: '∞' },
  ];

  return (
    <Section title="7. Radius scale" subtitle={`우리 ${oursRadius.length}단계 vs 정의서 ${specRadius.length}단계 — 카드 default(lg) 12px(spec) vs 14px(우리) 차이`}>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">우리 — radius (5단계)</div>
          <div className="flex gap-3 items-end">
            {oursRadius.map(([k, v]) => (
              <div key={k} className="flex flex-col items-center gap-1">
                <div className="h-12 w-12 bg-brand-primary" style={{ borderRadius: v }} />
                <code className="text-polaris-caption font-polaris-mono">{k}</code>
                <span className="text-polaris-caption text-fg-muted">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">정의서 — radius (8단계)</div>
          <div className="flex gap-2 items-end flex-wrap">
            {specRadius.map(({ key, px, star }) => {
              const r = px === '∞' ? '9999px' : px;
              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <div className="h-12 w-12" style={{ borderRadius: r, background: '#1D7FF9' }} />
                  <code className="text-polaris-caption font-polaris-mono">
                    {key}{star && ' ★'}
                  </code>
                  <span className="text-polaris-caption text-fg-muted">{px}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

function ButtonSection() {
  return (
    <Section title="8. Button — Primary" subtitle="정의서 6 variants × 3 sizes — 여기는 Primary 변형만 비교">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">우리 — Button variant=primary</div>
          <div className="flex flex-col items-start gap-3">
            <Button size="lg">대화 시작하기</Button>
            <Button size="md">새 채팅</Button>
            <Button size="sm">저장</Button>
          </div>
          <p className="text-polaris-caption text-fg-muted mt-3">background = brand.primary({brand.primary.light})</p>
        </div>
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">정의서 — Primary</div>
          <div className="flex flex-col items-start gap-3">
            <button type="button" style={{ height: 40, padding: '0 18px', borderRadius: 10, background: '#1D7FF9', color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
              대화 시작하기
            </button>
            <button type="button" style={{ height: 32, padding: '0 14px', borderRadius: 8, background: '#1D7FF9', color: 'white', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit' }}>
              새 채팅
            </button>
            <button type="button" style={{ height: 26, padding: '0 10px', borderRadius: 6, background: '#1D7FF9', color: 'white', fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit' }}>
              저장
            </button>
          </div>
          <p className="text-polaris-caption text-fg-muted mt-3">L 40·padding 18·radius 10 / D 32·14·8 / S 26·10·6</p>
        </div>
      </div>
    </Section>
  );
}

function FormInputSection() {
  return (
    <Section title="9. Form input — focus 상태" subtitle="정의서: focus 시 #1D7FF9 border + 3px outer glow">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">우리 — Polaris Input (focus)</div>
          <Input label="파일 이름" defaultValue="월간 보고서" autoFocus />
          <p className="text-polaris-caption text-fg-muted mt-2">outline 기반, 3px glow 없음</p>
        </div>
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">정의서 — focus state</div>
          <div>
            <label htmlFor="spec-focus" className="block text-polaris-body-sm font-medium mb-1.5">파일 이름</label>
            <input
              id="spec-focus"
              defaultValue="월간 보고서"
              style={{
                height: 36,
                padding: '0 12px',
                borderRadius: 8,
                border: '1px solid #1D7FF9',
                outline: 'none',
                boxShadow: '0 0 0 3px rgba(29, 127, 249, 0.25)',
                width: '100%',
                fontSize: 14,
                fontFamily: 'inherit',
                background: 'white',
                color: '#26282B',
              }}
            />
          </div>
          <p className="text-polaris-caption text-fg-muted mt-2">36px h · 8px r · 1px PO Blue + 3px glow</p>
        </div>
      </div>
    </Section>
  );
}

function NovaInputSection() {
  return (
    <Section title="10. AI prompt composer (NovaInput)" subtitle="정의서: shadow-ai purple glow 적용. 우리는 일반 outline">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">우리 — NovaInput</div>
          <div className="border border-surface-border-strong rounded-polaris-md p-3 bg-surface-raised">
            <input placeholder="무엇이든 물어보세요" className="w-full outline-none text-polaris-body-sm" />
          </div>
        </div>
        <div>
          <div className="text-polaris-body-sm font-semibold mb-2">정의서 — AI prompt composer</div>
          <div
            style={{
              border: '1px solid #E0D1FF',
              borderRadius: 14,
              padding: 14,
              background: 'white',
              boxShadow: '0 8px 32px rgba(111, 58, 208, 0.18), 0 2px 6px rgba(111, 58, 208, 0.10)',
              minHeight: 96,
            }}
            className="flex flex-col justify-between"
          >
            <input
              placeholder="무엇이든 물어보세요."
              style={{
                outline: 'none',
                border: 'none',
                width: '100%',
                fontSize: 14,
                fontFamily: 'inherit',
                background: 'transparent',
                color: '#26282B',
              }}
            />
            <div className="flex items-center justify-between">
              <span
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 9999,
                  background: '#F5F1FD',
                  color: '#511BB2',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                ✦ Polaris GPT-4
              </span>
              <button
                type="button"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  background: '#6F3AD0',
                  color: 'white',
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                ↑
              </button>
            </div>
          </div>
          <p className="text-polaris-caption text-fg-muted mt-2">
            14px radius · 14px padding · shadow-ai (purple glow) · 32×32 #6F3AD0 send button · model pill #F5F1FD/#511BB2
          </p>
        </div>
      </div>
    </Section>
  );
}

function CopyConventionSection() {
  return (
    <Section title="11. 카피 표준" subtitle="정의서가 한국어/영어 표준 카피를 명시 — 데모 코드와 비교 필요">
      <table className="w-full text-polaris-body-sm">
        <thead>
          <tr className="text-left border-b border-surface-border">
            <th className="py-2 pr-4 font-semibold">컨텍스트</th>
            <th className="py-2 pr-4 font-semibold">정의서 한국어</th>
            <th className="py-2 font-semibold">English</th>
          </tr>
        </thead>
        <tbody className="text-polaris-caption">
          {[
            ['입력 placeholder', '무엇이든 물어보세요.', 'Ask anything'],
            ['업로드 안내', '파일을 끌어다 놓으세요', 'Drag and drop a file'],
            ['새 채팅 버튼', '새 채팅', 'New chat'],
            ['응답 중 상태', '답변 생성중...', 'Generating response...'],
            ['업로드 완료', '업로드 완료', 'Upload complete'],
            ['오류 메시지', '다시 시도해 주세요.', 'Please try again.'],
            ['빈 상태', '아직 대화가 없어요', 'No conversations yet'],
          ].map(([ctx, ko, en]) => (
            <tr key={ctx} className="border-b border-surface-border last:border-0">
              <td className="py-2 pr-4 text-fg-muted">{ctx}</td>
              <td className="py-2 pr-4">{ko}</td>
              <td className="py-2">{en}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="text-polaris-caption text-fg-muted mt-3 space-y-1">
        <li>• 한국어 어미: ~해요 / ~세요 / ~할까요? (해요체). 반말 금지.</li>
        <li>• 이모지 ❌. 아이콘으로 의미 전달.</li>
        <li>• 한·영 혼용 시 영어는 약어/고유명사에만 (AI, PDF, GPT-4).</li>
        <li>• 날짜: <code className="font-polaris-mono">2025.09.04</code> · 시간: <code className="font-polaris-mono">14:30</code> · 숫자: <code className="font-polaris-mono">12,400명</code> · 퍼센트: <code className="font-polaris-mono">42%</code></li>
      </ul>
    </Section>
  );
}

/* ================================================================== *
 * Page
 * ================================================================== */

export default function DesignAudit() {
  return (
    <div className={cn('max-w-6xl mx-auto px-6 py-12 space-y-12')}>
      <header>
        <Badge variant="warning" className="mb-4">임시 · 검토용</Badge>
        <h1 className="text-polaris-display-md mb-3">디자인 정의서 vs 현재 구현</h1>
        <p className="text-polaris-body-lg text-fg-secondary max-w-2xl">
          디자인팀의 <code className="font-polaris-mono text-polaris-body-sm bg-surface-sunken px-1 rounded-polaris-sm">Polaris Office Design System v1 (2026.05)</code> 정식 spec과 우리 <code className="font-polaris-mono text-polaris-body-sm bg-surface-sunken px-1 rounded-polaris-sm">tokens.ts</code>에 정의된 값을 시각적으로 비교합니다. 토큰 값이 정의서로 정렬된 후 이 페이지는 삭제 예정.
        </p>
      </header>

      <BrandColorsSection />
      <FormatColorsSection />
      <GrayRampSection />
      <PaletteRampSection />
      <StatusColorsSection />
      <TypographySection />
      <RadiusSection />
      <ButtonSection />
      <FormInputSection />
      <NovaInputSection />
      <CopyConventionSection />
    </div>
  );
}
