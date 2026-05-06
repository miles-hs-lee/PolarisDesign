/**
 * Design tokens reference — renders every token from `@polaris/ui/tokens`
 * as a swatch / sample. Lives inside the demo SPA so the sidebar/navbar stay
 * visible (replaces the older static `swatches.html` page).
 */
import {
  brandPalette,
  brand,
  fileType,
  status,
  neutral,
  surface,
  text,
  textStyle,
  radius,
  shadow,
} from '@polaris/ui/tokens';
import { Badge, Card, CardBody } from '@polaris/ui';

type ColorPair = { light: string; dark: string };

function ColorSwatch({ name, value }: { name: string; value: ColorPair }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-polaris-md hover:bg-background-alternative">
      <div
        className="flex h-10 w-20 shrink-0 rounded-polaris-sm overflow-hidden border border-line-neutral"
        aria-hidden="true"
      >
        <div className="flex-1" style={{ background: value.light }} title={`light ${value.light}`} />
        <div className="flex-1" style={{ background: value.dark }} title={`dark ${value.dark}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-polaris-body2 font-semibold truncate">{name}</div>
        <div className="text-polaris-caption1 text-label-alternative font-polaris-mono">
          {value.light} / {value.dark}
        </div>
      </div>
    </div>
  );
}

function ColorSection({
  title,
  description,
  tokens,
}: {
  title: string;
  description?: string;
  tokens: Record<string, ColorPair>;
}) {
  return (
    <section>
      <h2 className="text-polaris-heading3 mb-1">{title}</h2>
      {description && <p className="text-polaris-body2 text-label-neutral mb-4">{description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {Object.entries(tokens).map(([name, value]) => (
          <ColorSwatch key={name} name={name} value={value} />
        ))}
      </div>
    </section>
  );
}

export default function Tokens() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <header>
        <Badge variant="secondary" className="mb-4">@polaris/ui/tokens</Badge>
        <h1 className="text-polaris-title mb-3">디자인 토큰</h1>
        <p className="text-polaris-body1 text-label-neutral max-w-2xl">
          모든 색상·타이포·반경·그림자는 <code className="font-polaris-mono text-polaris-body2 bg-background-alternative px-1 rounded-polaris-sm">@polaris/ui/tokens</code>에서
          가져옵니다. 라이트/다크 페어로 정의되어 있으며, Tailwind 변수로 자동 매핑됩니다.
        </p>
      </header>

      <ColorSection
        title="브랜드 팔레트"
        description="4색 베이스 + NOVA 보라. 시맨틱 컬러는 이 팔레트 위에 alias됩니다."
        tokens={brandPalette}
      />

      <ColorSection
        title="브랜드 시맨틱"
        description="primary / secondary 와 hover·subtle 변형."
        tokens={brand}
      />

      <ColorSection
        title="파일 타입"
        description="문서 형식별 색상. 파일 아이콘·뱃지에 사용."
        tokens={fileType}
      />

      <ColorSection
        title="상태"
        description="success / warning / danger / info — Toast·Alert·Form 검증."
        tokens={status}
      />

      <ColorSection
        title="뉴트럴 11단계"
        description="0 (가장 밝음) → 1000 (가장 어두움). 다크 모드에서 자동 반전."
        tokens={neutral}
      />

      <ColorSection
        title="Surface / Text"
        description="시맨틱 surface와 텍스트 컬러 alias."
        tokens={{ ...surface, ...text }}
      />

      <section>
        <h2 className="text-polaris-heading3 mb-1">타이포그래피</h2>
        <p className="text-polaris-body2 text-label-neutral mb-4">
          Pretendard Variable 패밀리 + 8단계 스케일. <code className="font-polaris-mono text-polaris-body2 bg-background-alternative px-1 rounded-polaris-sm">text-polaris-*</code> 유틸로 사용.
        </p>
        <Card>
          <CardBody>
            <div className="space-y-4">
              {Object.entries(textStyle).map(([name, style]) => (
                <div key={name} className="flex items-baseline gap-4 border-b border-line-neutral last:border-0 pb-3 last:pb-0">
                  <code className="font-polaris-mono text-polaris-caption1 text-label-alternative shrink-0 w-24">{name}</code>
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
      </section>

      <section>
        <h2 className="text-polaris-heading3 mb-1">반경 (Radius)</h2>
        <p className="text-polaris-body2 text-label-neutral mb-4">
          버튼·카드·인풋의 모서리 반경. <code className="font-polaris-mono text-polaris-body2 bg-background-alternative px-1 rounded-polaris-sm">rounded-polaris-*</code> 유틸로 사용.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(radius).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="h-20 w-20 bg-accent-brand-normal"
                style={{ borderRadius: value }}
                aria-hidden="true"
              />
              <code className="text-polaris-caption1 font-polaris-mono">{name}</code>
              <span className="text-polaris-caption1 text-label-alternative">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-polaris-heading3 mb-1">그림자 (Shadow)</h2>
        <p className="text-polaris-body2 text-label-neutral mb-4">
          엘레베이션 4단계. 라이트/다크 페어. <code className="font-polaris-mono text-polaris-body2 bg-background-alternative px-1 rounded-polaris-sm">shadow-polaris-*</code> 유틸로 사용.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {(Object.keys(shadow.light) as Array<keyof typeof shadow.light>).map((name) => (
            <div key={name} className="flex flex-col items-center gap-3 p-4">
              <div
                className="h-20 w-full rounded-polaris-md bg-background-normal"
                style={{ boxShadow: shadow.light[name] }}
                aria-hidden="true"
              />
              <code className="text-polaris-caption1 font-polaris-mono">{name}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
