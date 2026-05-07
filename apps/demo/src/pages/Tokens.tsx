/**
 * Design tokens reference — the visual companion to DESIGN.md.
 *
 * Color tokens are auto-iterated from `@polaris/ui/tokens.colors` so
 * any new addition (palette, semantic group) shows up here without a
 * code change. Non-color tokens (spacing / radius / shadow / motion /
 * z-index / breakpoint) get explicit sections with rendered samples.
 *
 * Each section header embeds the figma-spec PNG (synced from
 * `assets/figma-spec/` via `pnpm sync:figma-spec`) so this page mirrors
 * what the design team painted in Figma.
 */
import {
  colors,
  radius,
  shadow,
  textStyle,
  spacingNamed,
  breakpoint,
  duration,
  easing,
  zIndex,
} from '@polaris/ui/tokens';
import { Badge, Card, CardBody } from '@polaris/ui';

const FIGMA = `${import.meta.env.BASE_URL}figma-spec`;

type ColorPair = { light: string; dark: string };
type ColorValue = ColorPair | string;
type ColorGroup = Record<string, ColorValue>;

function isColorPair(v: unknown): v is ColorPair {
  return typeof v === 'object' && v !== null && 'light' in v && 'dark' in v;
}

/** A single token swatch — handles both `ColorPair` (light/dark split) and
 *  plain hex strings (palette ramps, gray ramp). */
function ColorSwatch({ name, value }: { name: string; value: ColorValue }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-polaris-md hover:bg-background-alternative">
      <div
        className="flex h-10 w-20 shrink-0 rounded-polaris-sm overflow-hidden border border-line-neutral"
        aria-hidden="true"
      >
        {isColorPair(value) ? (
          <>
            <div className="flex-1" style={{ background: value.light }} title={`light ${value.light}`} />
            <div className="flex-1" style={{ background: value.dark }} title={`dark ${value.dark}`} />
          </>
        ) : (
          <div className="flex-1" style={{ background: value }} title={value} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-polaris-body2 font-semibold truncate">{name}</div>
        <div className="text-polaris-caption1 text-label-alternative font-polaris-mono">
          {isColorPair(value) ? `${value.light} / ${value.dark}` : value}
        </div>
      </div>
    </div>
  );
}

function ColorGrid({ tokens }: { tokens: ColorGroup }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
      {Object.entries(tokens).map(([name, value]) => (
        <ColorSwatch key={name} name={name} value={value} />
      ))}
    </div>
  );
}

function GroupBlock({
  name,
  desc,
  tokens,
}: {
  name: string;
  desc?: string;
  tokens: ColorGroup;
}) {
  return (
    <div className="space-y-2">
      <div>
        <code className="font-polaris-mono text-polaris-body2 font-semibold text-label-normal">
          {name}
        </code>
        {desc && <p className="text-polaris-caption1 text-label-alternative">{desc}</p>}
      </div>
      <ColorGrid tokens={tokens} />
    </div>
  );
}

/** Top-level section with optional Figma spec PNG header. */
function Section({
  title,
  description,
  specImage,
  children,
}: {
  title: string;
  description?: string;
  specImage?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-polaris-md">
      <header className="space-y-polaris-2xs">
        <h2 className="text-polaris-heading2 text-label-normal">{title}</h2>
        {description && (
          <p className="text-polaris-body2 text-label-neutral max-w-3xl">{description}</p>
        )}
        {specImage && (
          <details className="text-polaris-caption1 text-label-alternative">
            <summary className="cursor-pointer hover:text-label-neutral">
              Figma spec 시각 자료 보기
            </summary>
            <img
              src={`${FIGMA}/${specImage}`}
              alt={`${title} Figma spec`}
              className="mt-polaris-2xs max-w-full rounded-polaris-sm border border-line-neutral"
              loading="lazy"
            />
          </details>
        )}
      </header>
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Color group taxonomy — auto-iterated. Adding a new group to
// `colors` in `@polaris/ui/tokens` and slotting it into the right
// bucket here is a 1-line change.
// ─────────────────────────────────────────────────────────────────────
const SEMANTIC_GROUPS: Array<{ name: string; tokens: ColorGroup; desc?: string }> = [
  { name: 'label',         tokens: colors.label as ColorGroup,         desc: '텍스트 + 아이콘 (normal / neutral / alternative / assistive / inverse / disabled)' },
  { name: 'background',    tokens: colors.background as ColorGroup,    desc: '페이지 레벨 배경 (base / disabled). rc.0 alias normal / alternative 포함' },
  { name: 'layer',         tokens: colors.layer as ColorGroup,         desc: 'rc.1 NEW — 카드 / 다이얼로그 surface, modal overlay' },
  { name: 'interaction',   tokens: colors.interaction as ColorGroup,   desc: 'hover / pressed' },
  { name: 'fill',          tokens: colors.fill as ColorGroup,          desc: '틴트된 표면 (neutral 가장 옅음 → strong 가장 진함)' },
  { name: 'line',          tokens: colors.line as ColorGroup,          desc: '보더 / 디바이더 (neutral / normal / strong / disabled)' },
  { name: 'accentBrand',   tokens: colors.accentBrand as ColorGroup,   desc: 'PO Blue 강조 (Primary CTA / Secondary tint)' },
  { name: 'accentAction',  tokens: colors.accentAction as ColorGroup,  desc: 'rc.1 NEW — Black "Primary Dark" 버튼 (다크모드 자동 반전)' },
  { name: 'focus',         tokens: colors.focus as ColorGroup,         desc: '키보드 포커스 ring' },
  { name: 'staticColors',  tokens: colors.staticColors as ColorGroup,  desc: 'rc.1 NEW — 모드 무관 흰색/검정' },
  { name: 'state',         tokens: colors.state as ColorGroup,         desc: 'success / warning / error / info / new + bg 변형 (rc.1 spec)' },
  { name: 'ai',            tokens: colors.ai as ColorGroup,            desc: 'Polaris 확장 — AI Purple (NOVA 전용)' },
];

const BRAND_RAMPS: Array<{ name: string; tokens: ColorGroup; desc?: string }> = [
  { name: 'bluePalette',     tokens: colors.bluePalette as ColorGroup,     desc: 'PO Blue — 메인 브랜드 + Word 파일 액센트' },
  { name: 'darkBluePalette', tokens: colors.darkBluePalette as ColorGroup, desc: 'PO Dark Blue — 마케팅 헤더, 서브 브랜드' },
  { name: 'greenPalette',    tokens: colors.greenPalette as ColorGroup,    desc: 'Sheet — Excel 액센트, state.success' },
  { name: 'orangePalette',   tokens: colors.orangePalette as ColorGroup,   desc: 'Slide — PowerPoint 액센트, state.warning' },
  { name: 'redPalette',      tokens: colors.redPalette as ColorGroup,      desc: 'PDF — state.error' },
  { name: 'purplePalette',   tokens: colors.purplePalette as ColorGroup,   desc: 'AI Purple — NOVA 전용' },
];

const SUPPLEMENTARY_RAMPS: Array<{ name: string; tokens: ColorGroup; desc?: string }> = [
  { name: 'skyBluePalette',           tokens: colors.skyBluePalette as ColorGroup,           desc: '플랜 뱃지 / 액센트 (PO Blue 보다 친근)' },
  { name: 'blueSupplementaryPalette', tokens: colors.blueSupplementaryPalette as ColorGroup, desc: '보조 블루 — PO Blue와 같은 화면에서 충돌 회피용' },
  { name: 'violetPalette',            tokens: colors.violetPalette as ColorGroup,            desc: '차트 / 태그 보라 — AI Purple와는 별개' },
  { name: 'cyanPalette',              tokens: colors.cyanPalette as ColorGroup,              desc: '이미지 / 미디어 포맷' },
  { name: 'yellowPalette',            tokens: colors.yellowPalette as ColorGroup,            desc: '노트 / 하이라이트 (warning과 다름)' },
];

const LEGACY_GROUPS: Array<{ name: string; tokens: ColorGroup; desc?: string }> = [
  { name: 'brandPalette',  tokens: colors.brandPalette as ColorGroup,  desc: 'v0.6 5-step alias (램프는 위 brand ramps 사용)' },
  { name: 'brand',         tokens: colors.brand as ColorGroup,         desc: 'rc.0 alias of accentBrand / ai' },
  { name: 'fileType',      tokens: colors.fileType as ColorGroup,      desc: 'docx/hwp/xlsx/pptx/pdf 컬러 (29-type FileIcon에서 사용)' },
  { name: 'status',        tokens: colors.status as ColorGroup,        desc: 'v0.6 — rc.1 state로 대체됨' },
  { name: 'neutral',       tokens: colors.neutral as ColorGroup,       desc: 'v0.6 12-step neutral (rc.1 grayRamp 9-step 권장)' },
  { name: 'surface',       tokens: colors.surface as ColorGroup,       desc: 'v0.6 — rc.1 layer/background로 대체됨' },
  { name: 'text',          tokens: colors.text as ColorGroup,          desc: 'v0.6 — rc.1 label로 대체됨' },
  { name: 'primary',       tokens: colors.primary as ColorGroup,       desc: 'rc.0 alias of accentBrand' },
];

export default function Tokens() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-polaris-3xl">
      <header>
        <Badge variant="secondary" className="mb-polaris-sm">@polaris/ui/tokens</Badge>
        <h1 className="text-polaris-title mb-polaris-2xs">디자인 토큰</h1>
        <p className="text-polaris-body1 text-label-neutral max-w-2xl">
          v0.7-rc.2 토큰 전수 표시. 색상은{' '}
          <code className="font-polaris-mono text-polaris-body2 bg-background-alternative px-1 rounded-polaris-sm">colors</code>{' '}
          export에서 자동 iterate되므로 새 그룹 추가 시 자동 반영됩니다. 디자인 정의서:{' '}
          <a href="https://github.com/miles-hs-lee/PolarisDesign/blob/main/DESIGN.md" target="_blank" rel="noreferrer" className="text-accent-brand-normal underline">DESIGN.md</a>.
        </p>
      </header>

      {/* ──────────── 색상 ──────────── */}
      <Section
        title="1. 시맨틱 토큰 (rc.1 spec)"
        description="UI 구현 시 항상 이 시맨틱 토큰부터 사용. 다크모드는 [data-theme=&quot;dark&quot;]로 자동 스위칭."
        specImage="foundation/color.png"
      >
        <div className="space-y-polaris-lg">
          {SEMANTIC_GROUPS.map((g) => (
            <GroupBlock key={g.name} {...g} />
          ))}
        </div>
      </Section>

      <Section
        title="2. 브랜드 컬러 램프 (10단계)"
        description="brand 5색 + Dark Blue. 차트 / hover / pressed 미세조정용. 시맨틱 토큰으로 표현 안 되는 경우만 직접 사용."
      >
        <div className="space-y-polaris-lg">
          {BRAND_RAMPS.map((g) => (
            <GroupBlock key={g.name} {...g} />
          ))}
        </div>
      </Section>

      <Section
        title="3. 서브 팔레트 (rc.1 신설)"
        description="primitive-color-palette 참조. 차트 카테고리 / 플랜 뱃지 / 파일 확장자 등."
      >
        <div className="space-y-polaris-lg">
          {SUPPLEMENTARY_RAMPS.map((g) => (
            <GroupBlock key={g.name} {...g} />
          ))}
        </div>
      </Section>

      <Section
        title="4. Gray Ramp (UI 백본)"
        description="텍스트 / 보더 / surface / interaction의 베이스. 9 steps 10 → 90."
      >
        <GroupBlock name="grayRamp" tokens={colors.grayRamp as ColorGroup} />
      </Section>

      <Section
        title="5. 레거시 alias (deprecated)"
        description="v0.6 / rc.0 호환용. 새 코드는 위 시맨틱 토큰 사용. v0.8에서 제거 예정."
      >
        <div className="space-y-polaris-lg">
          {LEGACY_GROUPS.map((g) => (
            <GroupBlock key={g.name} {...g} />
          ))}
        </div>
      </Section>

      {/* ──────────── 타이포그래피 ──────────── */}
      <Section
        title="6. 타이포그래피"
        description="Pretendard Variable. 11단계 (rc.1 spec). letter-spacing 사용 금지 — Pretendard 자체 메트릭 사용."
        specImage="foundation/typography.png"
      >
        <Card>
          <CardBody>
            <div className="space-y-polaris-md">
              {Object.entries(textStyle).map(([name, style]) => (
                <div
                  key={name}
                  className="flex items-baseline gap-polaris-md border-b border-line-neutral last:border-0 pb-polaris-2xs last:pb-0"
                >
                  <code className="font-polaris-mono text-polaris-caption1 text-label-alternative shrink-0 w-28">
                    {name}
                  </code>
                  <div
                    style={{
                      fontSize: style.fontSize,
                      lineHeight: style.lineHeight,
                      fontWeight: style.fontWeight,
                      letterSpacing: style.letterSpacing,
                    }}
                  >
                    The quick brown fox 다람쥐 헌 쳇바퀴
                  </div>
                  <span className="ml-auto text-polaris-caption1 text-label-alternative font-polaris-mono whitespace-nowrap">
                    {style.fontSize} / {style.lineHeight} / {style.fontWeight}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        <p className="text-polaris-caption1 text-label-alternative">
          모바일 (≤767px): tokens.css의 @media 블록이 자동으로 한 단계씩 축소. 별도 클래스 변경 불필요.
        </p>
      </Section>

      {/* ──────────── Spacing ──────────── */}
      <Section
        title="7. Spacing (rc.1 NEW)"
        description="4px 베이스 + 12레벨 named scale. Tailwind class form: p-polaris-md, gap-polaris-lg 등."
        specImage="foundation/grid.png"
      >
        <div className="space-y-polaris-2xs">
          {Object.entries(spacingNamed).map(([name, value]) => {
            const px = parseInt(value, 10) || 0;
            return (
              <div key={name} className="flex items-center gap-polaris-md">
                <code className="font-polaris-mono text-polaris-caption1 text-label-alternative shrink-0 w-24">
                  {name}
                </code>
                <div
                  className="bg-accent-brand-normal h-3 rounded-polaris-2xs"
                  style={{ width: `${Math.max(2, px) * 2}px` }}
                  aria-hidden="true"
                />
                <span className="text-polaris-caption1 text-label-neutral font-polaris-mono">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ──────────── Radius ──────────── */}
      <Section
        title="8. Radius (rc.1 — md 12px default)"
        description="rounded-polaris-* 유틸. 기본값 md(12). Input은 sm(8). 큰 CTA는 lg(16). 모달 xl(24). 바텀시트 2xl(38)."
        specImage="foundation/radius.png"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-polaris-2xs">
          {Object.entries(radius).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-polaris-3xs">
              <div
                className="h-16 w-16 bg-accent-brand-normal"
                style={{ borderRadius: value }}
                aria-hidden="true"
              />
              <code className="text-polaris-caption1 font-polaris-mono">{name}</code>
              <span className="text-polaris-caption2 text-label-alternative">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ──────────── Shadow ──────────── */}
      <Section
        title="9. Shadow (5단계 + AI glow)"
        description="shadow-polaris-* 유틸. xs(hover) / sm(card) / md(dropdown) / lg(modal) / ai(AI 표면 보라 글로우, rc.1 NEW)."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-polaris-md">
          {(Object.keys(shadow.light) as Array<keyof typeof shadow.light>).map((name) => (
            <div key={name} className="flex flex-col items-center gap-polaris-2xs p-polaris-md bg-background-alternative rounded-polaris-md">
              <div
                className="h-16 w-full rounded-polaris-md bg-layer-surface"
                style={{ boxShadow: shadow.light[name] }}
                aria-hidden="true"
              />
              <code className="text-polaris-caption1 font-polaris-mono">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ──────────── Motion ──────────── */}
      <Section
        title="10. Motion (rc.1 NEW)"
        description="duration-polaris-* / ease-polaris-* 유틸. 박스에 hover하면 적용 미리보기."
      >
        <div className="space-y-polaris-md">
          <div>
            <h3 className="text-polaris-body2 font-semibold text-label-normal mb-polaris-2xs">Duration</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-polaris-md">
              {Object.entries(duration).map(([name, value]) => (
                <div key={name} className="flex flex-col items-center gap-polaris-3xs">
                  <div
                    className="h-12 w-12 bg-fill-normal hover:bg-accent-brand-normal hover:scale-110 rounded-polaris-md cursor-pointer"
                    style={{ transition: `all ${value} cubic-bezier(0.4, 0, 0.2, 1)` }}
                    aria-hidden="true"
                  />
                  <code className="text-polaris-caption1 font-polaris-mono">{name}</code>
                  <span className="text-polaris-caption2 text-label-alternative">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-polaris-body2 font-semibold text-label-normal mb-polaris-2xs">Easing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-polaris-md">
              {Object.entries(easing).map(([name, value]) => (
                <div key={name} className="flex items-center gap-polaris-md p-polaris-md rounded-polaris-md border border-line-neutral">
                  <div
                    className="h-10 w-10 bg-fill-normal hover:bg-accent-brand-normal hover:translate-x-12 rounded-polaris-md cursor-pointer"
                    style={{ transition: `all 600ms ${value}` }}
                    aria-hidden="true"
                  />
                  <div>
                    <code className="text-polaris-caption1 font-polaris-mono block">{name}</code>
                    <span className="text-polaris-caption2 text-label-alternative font-polaris-mono break-all">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ──────────── Z-index ──────────── */}
      <Section
        title="11. Z-index (rc.1 NEW)"
        description="z-polaris-* 유틸. 6단계로 floating 요소 정리. 임의 z 값 사용 금지 — 새 단계가 필요하면 이 스케일을 확장."
      >
        <Card>
          <CardBody>
            <table className="w-full text-polaris-body2">
              <thead>
                <tr className="text-left border-b border-line-neutral">
                  <th className="py-polaris-2xs font-semibold w-32">Token</th>
                  <th className="py-polaris-2xs font-semibold w-20">Value</th>
                  <th className="py-polaris-2xs font-semibold">Use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['base', '일반 콘텐츠'],
                  ['dropdown', 'Dropdown · Tooltip · Popover'],
                  ['sticky', 'Sticky 헤더 · 고정 탭'],
                  ['dim', '모달 dim 오버레이'],
                  ['modal', 'Modal · Popup · Bottom sheet'],
                  ['toast', 'Toast (최상위)'],
                ].map(([token, use]) => (
                  <tr key={token} className="border-b border-line-neutral last:border-0">
                    <td className="py-polaris-2xs">
                      <code className="font-polaris-mono text-polaris-caption1">{token}</code>
                    </td>
                    <td className="py-polaris-2xs">
                      <code className="font-polaris-mono text-polaris-caption1 text-label-alternative">
                        {zIndex[token as keyof typeof zIndex]}
                      </code>
                    </td>
                    <td className="py-polaris-2xs text-label-neutral">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Section>

      {/* ──────────── Breakpoint ──────────── */}
      <Section
        title="12. Breakpoint"
        description="Tailwind 기본 5단계 + rc.1에서 추가된 시맨틱 4단계 (mobile / tablet-v / tablet-h / desktop)."
      >
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-polaris-md">
              {Object.entries(breakpoint).map(([name, value]) => (
                <div key={name} className="flex items-center justify-between gap-polaris-md py-polaris-2xs px-polaris-2xs rounded-polaris-sm hover:bg-background-alternative">
                  <code className="font-polaris-mono text-polaris-caption1 text-label-normal">
                    {name}
                  </code>
                  <code className="font-polaris-mono text-polaris-caption1 text-label-alternative">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </Section>

      {/* ──────────── Iconography pointer ──────────── */}
      <Section
        title="13. Iconography"
        description="65 UI 아이콘 + 29 파일 아이콘 + 4 로고. /icons 카탈로그 페이지 참고."
        specImage="theme/iconography.png"
      >
        <Card>
          <CardBody>
            <p className="text-polaris-body2 text-label-neutral">
              아이콘 전체 카탈로그 →{' '}
              <a href="#/icons" className="text-accent-brand-normal underline">
                /icons 페이지
              </a>
              . Import 경로:{' '}
              <code className="font-polaris-mono text-polaris-caption1 bg-background-alternative px-1 rounded-polaris-2xs">
                @polaris/ui/icons
              </code>
              ,{' '}
              <code className="font-polaris-mono text-polaris-caption1 bg-background-alternative px-1 rounded-polaris-2xs">
                @polaris/ui/file-icons
              </code>
              ,{' '}
              <code className="font-polaris-mono text-polaris-caption1 bg-background-alternative px-1 rounded-polaris-2xs">
                @polaris/ui/logos
              </code>
              .
            </p>
          </CardBody>
        </Card>
      </Section>
    </div>
  );
}
