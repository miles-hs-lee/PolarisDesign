/**
 * Polaris Office editor ribbon recreation — uses `@polaris/ui/ribbon` to
 * rebuild the actual https://www.polarisoffice.com/editor/po/word ribbon
 * tab-by-tab. Icons are best-effort lucide-react matches; the structural
 * fidelity (tab order, group layout, button hierarchy, labels) is exact.
 *
 * Each tab is its own component so consumers can copy-paste any one of
 * them as a starting point for their own editor ribbon.
 */
import { useState, type ReactNode } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Input,
  FileIcon as FileIconBadge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SimpleTooltip,
  DropdownMenuItem,
  cn,
} from '@polaris/ui';
import {
  Ribbon,
  RibbonTabs,
  RibbonTabList,
  RibbonTab,
  RibbonContent,
  RibbonGroup,
  RibbonStack,
  RibbonRow,
  RibbonSeparator,
  RibbonRowDivider,
  RibbonButton,
  RibbonSplitButton,
  RibbonMenuButton,
  RibbonToggleGroup,
  RibbonToggleItem,
} from '@polaris/ui/ribbon';
import {
  // chrome + file backstage
  Menu, Star, Save, ChevronDown, ChevronUp, Monitor, UsersRound, Bell,
  ArrowLeft, HardDrive, Folder as FolderIcon,
  // home tab
  Clipboard, Scissors, Copy, Brush,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Highlighter, Type, Eraser, SquareUser,
  List, ListOrdered, ListTree, IndentDecrease, IndentIncrease,
  PaintBucket, ArrowLeftRight,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, WrapText,
  ChevronsUpDown, CornerDownLeft, Pilcrow, AlignVerticalSpaceBetween,
  Pencil, Search, Replace, CaseSensitive, AArrowUp, AArrowDown,
  // insert tab
  FilePlus, SeparatorHorizontal, Table, Image as ImageIcon,
  Globe, Shapes, Link as LinkIcon, Bookmark, TextCursorInput, Sigma,
  // layout tab
  Columns3, RotateCw, Maximize2, SplitSquareVertical, Settings,
  Layout as LayoutIcon, Move, Group, ArrowUpToLine, ArrowDownToLine,
  // review tab
  Check, X as XIcon, ChevronLeft, ChevronRight,
  MessageSquarePlus, MessageSquare, History, ListChecks,
  // AI tab
  Sparkles, Languages, Cloud, Mic, ImagePlus, Box,
  Eraser as Eraser2, Wand2, Maximize, ZoomIn, Palette as PaletteIcon,
  BookOpen, FileText,
  type LucideIcon,
} from 'lucide-react';

/* ================================================================== *
 * Composite icons used by ribbon buttons. These are demo-specific
 * pictograms (color picker swatches, image-with-globe overlay, …) —
 * not part of `@polaris/ui`. Define them once and reuse below.
 * ================================================================== */

/** Icon stacked over a colored underline bar — used for 글자 색 / 형광펜. */
function ColorAccentIcon({
  icon: Icon,
  iconClass,
  barClass,
}: {
  icon: LucideIcon;
  iconClass?: string;
  barClass: string;
}) {
  return (
    <span className="flex flex-col items-center leading-none">
      <Icon className={`h-3 w-3 ${iconClass ?? ''}`} />
      <span className={`block w-3 h-0.5 mt-0.5 ${barClass}`} />
    </span>
  );
}

/** Letter inside an outlined square — 문자 테두리. */
const OutlinedLetter = (
  <span className="inline-flex h-4 w-4 items-center justify-center border-2 border-fg-primary rounded-polaris-sm text-polaris-meta font-bold leading-none">
    A
  </span>
);

/** Two-line text icon for the 단어 개수 button. */
const WordCountIcon = (
  <span className="text-polaris-meta font-bold leading-tight text-center">
    ABC{'\n'}123
  </span>
);

/** Base icon with a small overlay element pinned to a corner. */
function OverlayIcon({ base, overlay }: { base: ReactNode; overlay: ReactNode }) {
  return <span className="relative inline-flex">{base}{overlay}</span>;
}

/* ================================================================== *
 * Editor chrome (top bar above the ribbon). Pure presentation —
 * mimics the document title, save indicator, share/notify, avatar.
 * ================================================================== */

function EditorChrome() {
  return (
    <div className="flex items-center gap-2 h-12 px-3 border-b border-line-neutral bg-background-normal">
      <Button variant="ghost" size="sm" aria-label="Menu" className="!h-9 !w-9 !px-0 shrink-0">
        <Menu className="h-5 w-5 text-primary-normal" />
      </Button>
      <div className="flex items-center gap-1.5 text-polaris-body-sm min-w-0">
        <span className="truncate">NewDocument 2026-05-05 063559.docx</span>
        <ChevronDown className="h-4 w-4 text-label-alternative shrink-0" aria-hidden="true" />
      </div>
      <Button variant="ghost" size="sm" aria-label="즐겨찾기" className="!h-8 !w-8 !px-0 ml-1 shrink-0 hidden sm:inline-flex">
        <Star className="h-4 w-4 text-label-alternative" />
      </Button>
      <SimpleTooltip label="저장됨">
        <Button variant="ghost" size="sm" aria-label="저장" className="!h-8 !w-8 !px-0 shrink-0">
          <Save className="h-4 w-4 text-primary-normal" />
        </Button>
      </SimpleTooltip>
      <div className="ml-auto flex items-center gap-1 shrink-0">
        {/* Compact: collapse "PC 앱으로 열기" / "공유" / "Miles (이해석)" labels
            below md so the bar fits on phones without overlapping.
            Buttons stay clickable; icons keep them recognizable. */}
        <Button variant="ghost" size="sm" aria-label="PC 앱으로 열기" className="gap-1.5">
          <Monitor className="h-4 w-4" aria-hidden="true" />
          <span className="font-semibold hidden lg:inline">PC 앱으로 열기</span>
        </Button>
        <Button variant="ghost" size="sm" aria-label="공유" className="gap-1.5">
          <UsersRound className="h-4 w-4" aria-hidden="true" />
          <span className="hidden md:inline">공유</span>
        </Button>
        <Button variant="ghost" size="sm" aria-label="알림" className="gap-1.5">
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="hidden md:inline">알림</span>
        </Button>
        <Button variant="ghost" size="sm" aria-label="Miles (이해석)" className="gap-1.5">
          <Avatar size="sm">
            <AvatarFallback>이</AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline">Miles (이해석)</span>
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== *
 * 홈 — clipboard / font / paragraph / styles / find. Most diverse tab,
 * exercises every primitive (Stack, Row, Toggle, Split, Menu, Divider).
 * ================================================================== */

function HomeRibbon() {
  const [marks, setMarks] = useState<string[]>(['bold']);
  const [align, setAlign] = useState('justify');
  const [fontFamily, setFontFamily] = useState('나눔바른고딕');
  const [fontSize, setFontSize] = useState('10');

  return (
    <RibbonContent value="home">
      {/* Paste + cut/copy/format-paint stack */}
      <RibbonGroup>
        <RibbonSplitButton
          size="lg"
          icon={<Clipboard className="h-6 w-6 text-primary-normal" />}
          tooltip="붙여넣기 (⌘V)"
          menuLabel="붙여넣기 옵션"
          menu={
            <>
              <DropdownMenuItem>일반 붙여넣기</DropdownMenuItem>
              <DropdownMenuItem>서식 없이 붙여넣기</DropdownMenuItem>
              <DropdownMenuItem>특수 붙여넣기…</DropdownMenuItem>
            </>
          }
        >
          붙여넣기
        </RibbonSplitButton>
        <RibbonStack className="ml-0.5">
          <RibbonButton size="sm" disabled icon={<Scissors className="h-3.5 w-3.5" />}>잘라내기</RibbonButton>
          <RibbonButton size="sm" disabled icon={<Copy className="h-3.5 w-3.5" />}>복사</RibbonButton>
          <RibbonSplitButton
            size="sm"
            disabled
            icon={<Brush className="h-3.5 w-3.5" />}
            tooltip="서식 복사"
            menuLabel="서식 복사 옵션"
            menu={<DropdownMenuItem>서식 복사 잠금</DropdownMenuItem>}
          >
            서식복사
          </RibbonSplitButton>
        </RibbonStack>
      </RibbonGroup>

      <RibbonSeparator />

      {/* Font: family / size, sub-clusters separated by RowDivider */}
      <RibbonGroup>
        <RibbonStack>
          <RibbonRow>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="!h-6 w-32 !px-2 text-polaris-body-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="나눔바른고딕">나눔바른고딕</SelectItem>
                <SelectItem value="Pretendard">Pretendard</SelectItem>
                <SelectItem value="맑은 고딕">맑은 고딕</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              </SelectContent>
            </Select>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="!h-6 w-16 ml-0.5 !px-1.5 !gap-1 text-polaris-body-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['8', '9', '10', '11', '12', '14', '16', '18', '20', '24'].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <RibbonRowDivider />
            <RibbonButton tooltip="글자 크게" icon={<AArrowUp className="h-4 w-4" />} />
            <RibbonButton tooltip="글자 작게" icon={<AArrowDown className="h-4 w-4" />} />
            <RibbonRowDivider />
            <RibbonSplitButton
              tooltip="대소문자"
              icon={<CaseSensitive className="h-4 w-4" />}
              menuLabel="대소문자 옵션"
              menu={
                <>
                  <DropdownMenuItem>UPPERCASE</DropdownMenuItem>
                  <DropdownMenuItem>lowercase</DropdownMenuItem>
                  <DropdownMenuItem>Capitalize</DropdownMenuItem>
                </>
              }
            />
          </RibbonRow>
          <RibbonRow>
            <RibbonToggleGroup type="multiple" value={marks} onValueChange={setMarks}>
              <RibbonToggleItem value="bold" tooltip="굵게 (⌘B)" icon={<Bold className="h-4 w-4" />} />
              <RibbonToggleItem value="italic" tooltip="기울임 (⌘I)" icon={<Italic className="h-4 w-4" />} />
              <RibbonToggleItem value="underline" tooltip="밑줄 (⌘U)" icon={<Underline className="h-4 w-4" />} />
            </RibbonToggleGroup>
            <RibbonSplitButton
              icon={<Strikethrough className="h-4 w-4" />}
              tooltip="취소선"
              menuLabel="취소선 옵션"
              menu={
                <>
                  <DropdownMenuItem>단일선</DropdownMenuItem>
                  <DropdownMenuItem>이중선</DropdownMenuItem>
                </>
              }
            />
            <RibbonRowDivider />
            <RibbonButton tooltip="아래 첨자" icon={<Subscript className="h-4 w-4" />} />
            <RibbonButton tooltip="위 첨자" icon={<Superscript className="h-4 w-4" />} />
            <RibbonRowDivider />
            <RibbonButton tooltip="글자 색" icon={<ColorAccentIcon icon={Type} barClass="bg-status-danger" />} />
            <RibbonButton tooltip="형광펜" icon={<ColorAccentIcon icon={Highlighter} iconClass="text-status-warning" barClass="bg-status-warning" />} />
            <RibbonRowDivider />
            <RibbonButton tooltip="문자 강조 표시" icon={<SquareUser className="h-4 w-4" />} />
            <RibbonButton tooltip="문자 테두리" icon={OutlinedLetter} />
            <RibbonButton tooltip="서식 지우기" icon={<Eraser className="h-4 w-4" />} />
          </RibbonRow>
        </RibbonStack>
      </RibbonGroup>

      <RibbonSeparator />

      {/* Lists */}
      <RibbonGroup>
        <RibbonStack>
          <RibbonRow>
            <RibbonSplitButton tooltip="글머리 기호" icon={<List className="h-4 w-4" />} menuLabel="글머리 기호" menu={<DropdownMenuItem>· — ▪</DropdownMenuItem>} />
            <RibbonSplitButton tooltip="번호 매기기" icon={<ListOrdered className="h-4 w-4" />} menuLabel="번호 매기기" menu={<DropdownMenuItem>1. 2. 3.</DropdownMenuItem>} />
            <RibbonSplitButton tooltip="다단계 목록" icon={<ListTree className="h-4 w-4" />} menuLabel="다단계 목록" menu={<DropdownMenuItem>1.1.1</DropdownMenuItem>} />
          </RibbonRow>
          <RibbonRow>
            <RibbonButton tooltip="내어쓰기" icon={<IndentDecrease className="h-4 w-4" />} />
            <RibbonButton tooltip="들여쓰기" icon={<IndentIncrease className="h-4 w-4" />} />
          </RibbonRow>
        </RibbonStack>
      </RibbonGroup>

      <RibbonSeparator />

      {/* Fill / character spacing */}
      <RibbonGroup>
        <RibbonRow>
          <RibbonSplitButton tooltip="채우기 색" icon={<PaintBucket className="h-4 w-4" />} menuLabel="채우기 색" menu={<DropdownMenuItem>색 선택…</DropdownMenuItem>} />
          <RibbonSplitButton tooltip="문자 간격" icon={<ArrowLeftRight className="h-4 w-4" />} menuLabel="문자 간격" menu={<DropdownMenuItem>좁게 / 보통 / 넓게</DropdownMenuItem>} />
        </RibbonRow>
      </RibbonGroup>

      <RibbonSeparator />

      {/* Alignment + paragraph */}
      <RibbonGroup>
        <RibbonStack>
          <RibbonRow>
            <RibbonToggleGroup type="single" value={align} onValueChange={(v) => v && setAlign(v)}>
              <RibbonToggleItem value="left" tooltip="왼쪽 정렬" icon={<AlignLeft className="h-4 w-4" />} />
              <RibbonToggleItem value="center" tooltip="가운데 정렬" icon={<AlignCenter className="h-4 w-4" />} />
              <RibbonToggleItem value="right" tooltip="오른쪽 정렬" icon={<AlignRight className="h-4 w-4" />} />
              <RibbonToggleItem value="justify" tooltip="양쪽 정렬" icon={<AlignJustify className="h-4 w-4" />} />
              <RibbonToggleItem value="distribute" tooltip="배분 정렬" icon={<WrapText className="h-4 w-4" />} />
            </RibbonToggleGroup>
          </RibbonRow>
          <RibbonRow>
            <RibbonSplitButton tooltip="줄 간격" icon={<ChevronsUpDown className="h-4 w-4" />} menuLabel="줄 간격" menu={<DropdownMenuItem>1.0 / 1.5 / 2.0</DropdownMenuItem>} />
            <RibbonSplitButton tooltip="단락 간격" icon={<AlignVerticalSpaceBetween className="h-4 w-4" />} menuLabel="단락 간격" menu={<DropdownMenuItem>0 / 6 / 12pt</DropdownMenuItem>} />
            <RibbonButton tooltip="단락 들여쓰기" icon={<IndentIncrease className="h-4 w-4" />} />
            <RibbonButton tooltip="단락 기호 표시" icon={<Pilcrow className="h-4 w-4" />} />
            <RibbonButton tooltip="줄바꿈 표시" icon={<CornerDownLeft className="h-4 w-4" />} />
          </RibbonRow>
        </RibbonStack>
      </RibbonGroup>

      <RibbonSeparator />

      {/* Styles + find/replace */}
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Pencil className="h-6 w-6 text-status-danger" />}>스타일</RibbonButton>
      </RibbonGroup>

      <RibbonSeparator />

      <RibbonGroup>
        <RibbonStack>
          <RibbonSplitButton size="sm" icon={<Search className="h-4 w-4" />} tooltip="찾기" menuLabel="찾기 옵션" menu={<DropdownMenuItem>고급 찾기…</DropdownMenuItem>}>
            찾기
          </RibbonSplitButton>
          <RibbonButton size="sm" icon={<Replace className="h-4 w-4" />} tooltip="바꾸기">
            바꾸기
          </RibbonButton>
        </RibbonStack>
      </RibbonGroup>
    </RibbonContent>
  );
}

/* ================================================================== *
 * 삽입 — pages / images / shapes / hyperlinks / symbols. All `lg`
 * buttons; each in its own group (no labels because each group has a
 * single button — Office's convention).
 * ================================================================== */

function InsertRibbon() {
  return (
    <RibbonContent value="insert">
      <RibbonGroup>
        <RibbonButton size="lg" icon={<FilePlus className="h-6 w-6 text-label-neutral" />}>새{'\n'}페이지</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<SeparatorHorizontal className="h-6 w-6 text-status-danger" />}>페이지{'\n'}나누기</RibbonButton>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Table className="h-6 w-6 text-label-neutral" />}>표</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<ImageIcon className="h-6 w-6 text-status-success" />}>그림</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={
          <OverlayIcon
            base={<ImageIcon className="h-6 w-6 text-status-success" />}
            overlay={<Globe className="h-3 w-3 absolute -bottom-1 -right-1 text-primary-normal bg-background-normal rounded-polaris-pill" />}
          />
        }>온라인{'\n'}그림</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonSplitButton size="lg" icon={<Shapes className="h-6 w-6 text-label-neutral" />} menuLabel="도형 선택" menu={
          <>
            <DropdownMenuItem>사각형</DropdownMenuItem>
            <DropdownMenuItem>원</DropdownMenuItem>
            <DropdownMenuItem>화살표</DropdownMenuItem>
          </>
        }>도형</RibbonSplitButton>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonButton size="lg" icon={<LinkIcon className="h-6 w-6 text-label-neutral" />}>하이퍼{'\n'}링크</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={
          <OverlayIcon
            base={<Bookmark className="h-6 w-6 text-label-neutral" />}
            overlay={<span className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-1 bg-status-danger" aria-hidden="true" />}
          />
        }>책갈피</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonSplitButton size="lg" icon={<TextCursorInput className="h-6 w-6 text-label-neutral" />} menuLabel="텍스트 상자 종류" menu={
          <>
            <DropdownMenuItem>가로 텍스트 상자</DropdownMenuItem>
            <DropdownMenuItem>세로 텍스트 상자</DropdownMenuItem>
          </>
        }>텍스트{'\n'}상자</RibbonSplitButton>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Sigma className="h-6 w-6 text-label-neutral" />}>기호</RibbonButton>
      </RibbonGroup>
    </RibbonContent>
  );
}

/* ================================================================== *
 * 레이아웃 — page setup + image positioning. All option-style controls,
 * so the dominant primitive here is `RibbonMenuButton` (chevron-only,
 * no main action).
 * ================================================================== */

function LayoutRibbon() {
  return (
    <RibbonContent value="layout">
      <RibbonGroup>
        <RibbonMenuButton icon={<LayoutIcon className="h-6 w-6 text-label-neutral" />} menu={<DropdownMenuItem>좁게 / 보통 / 넓게</DropdownMenuItem>}>여백</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton icon={<RotateCw className="h-6 w-6 text-label-neutral" />} menu={<><DropdownMenuItem>세로</DropdownMenuItem><DropdownMenuItem>가로</DropdownMenuItem></>}>용지{'\n'}방향</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton icon={<Maximize2 className="h-6 w-6 text-label-neutral" />} menu={<><DropdownMenuItem>A4</DropdownMenuItem><DropdownMenuItem>Letter</DropdownMenuItem></>}>크기</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton icon={<Columns3 className="h-6 w-6 text-label-neutral" />} menu={<><DropdownMenuItem>1단</DropdownMenuItem><DropdownMenuItem>2단</DropdownMenuItem><DropdownMenuItem>3단</DropdownMenuItem></>}>단</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton icon={<SplitSquareVertical className="h-6 w-6 text-status-danger" />} menu={<><DropdownMenuItem>페이지 나누기</DropdownMenuItem><DropdownMenuItem>단 나누기</DropdownMenuItem><DropdownMenuItem>구역 나누기</DropdownMenuItem></>}>나누기</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Settings className="h-6 w-6 text-primary-normal" />}>페이지{'\n'}설정</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Settings className="h-6 w-6 text-primary-normal" />}>레이아웃{'\n'}설정</RibbonButton>
      </RibbonGroup>
      <RibbonSeparator />
      {/* Image-related — disabled until selection */}
      <RibbonGroup>
        <RibbonMenuButton disabled icon={<Move className="h-6 w-6" />} menu={<DropdownMenuItem>위치 선택</DropdownMenuItem>}>위치</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton disabled icon={<WrapText className="h-6 w-6" />} menu={<DropdownMenuItem>옵션</DropdownMenuItem>}>텍스트{'\n'}줄 바꿈</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton disabled icon={<Group className="h-6 w-6" />} menu={<DropdownMenuItem>그룹/해제</DropdownMenuItem>}>그룹</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton disabled icon={<ArrowUpToLine className="h-6 w-6" />} menu={<DropdownMenuItem>맨 앞으로</DropdownMenuItem>}>앞으로{'\n'}가져오기</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton disabled icon={<ArrowDownToLine className="h-6 w-6" />} menu={<DropdownMenuItem>맨 뒤로</DropdownMenuItem>}>뒤로{'\n'}보내기</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton disabled icon={<AlignLeft className="h-6 w-6" />} menu={<DropdownMenuItem>왼쪽/오른쪽/위/아래</DropdownMenuItem>}>맞춤</RibbonMenuButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonMenuButton disabled icon={<RotateCw className="h-6 w-6" />} menu={<><DropdownMenuItem>90° 회전</DropdownMenuItem><DropdownMenuItem>180° 회전</DropdownMenuItem></>}>회전</RibbonMenuButton>
      </RibbonGroup>
    </RibbonContent>
  );
}

/* ================================================================== *
 * 검토 — comments, change-tracking, accept/reject. Demonstrates an
 * `lg` toggle (변경내용 추적), `lg` split buttons, and an inline
 * `<Select>` placed next to ribbon buttons.
 * ================================================================== */

function ReviewRibbon() {
  const [trackChanges, setTrackChanges] = useState<string[]>(['track']);
  const [reviewView, setReviewView] = useState('all');

  return (
    <RibbonContent value="review">
      <RibbonGroup>
        <RibbonButton size="lg" icon={WordCountIcon}>단어{'\n'}개수</RibbonButton>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonButton size="lg" icon={<MessageSquarePlus className="h-6 w-6 text-status-warning" />}>새{'\n'}메모</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonSplitButton size="lg" disabled icon={<XIcon className="h-6 w-6" />} menuLabel="삭제 옵션" menu={<><DropdownMenuItem>삭제</DropdownMenuItem><DropdownMenuItem>모두 삭제</DropdownMenuItem></>}>삭제</RibbonSplitButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" disabled icon={<ChevronLeft className="h-6 w-6" />}>이전</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" disabled icon={<ChevronRight className="h-6 w-6" />}>다음</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<MessageSquare className="h-6 w-6 text-status-warning" />}>메모{'\n'}표시</RibbonButton>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonToggleGroup type="multiple" value={trackChanges} onValueChange={setTrackChanges}>
          <RibbonToggleItem value="track" size="lg" tooltip="변경내용 추적" icon={<History className="h-6 w-6 text-status-danger" />}>변경내용{'\n'}추적</RibbonToggleItem>
        </RibbonToggleGroup>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonSplitButton size="lg" icon={<ListChecks className="h-6 w-6 text-label-neutral" />} menuLabel="변경내용 표시 옵션" menu={
          <>
            <DropdownMenuItem>모든 변경 사항</DropdownMenuItem>
            <DropdownMenuItem>최종본</DropdownMenuItem>
            <DropdownMenuItem>원본</DropdownMenuItem>
          </>
        }>변경내용{'\n'}표시</RibbonSplitButton>
      </RibbonGroup>
      <RibbonGroup>
        <Select value={reviewView} onValueChange={setReviewView}>
          <SelectTrigger className="!h-8 w-36 text-polaris-body-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">메모 및 변경 내용 모두</SelectItem>
            <SelectItem value="changes">변경 내용만</SelectItem>
            <SelectItem value="comments">메모만</SelectItem>
          </SelectContent>
        </Select>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonSplitButton size="lg" icon={<Check className="h-6 w-6 text-status-success" />} menuLabel="적용 옵션" menu={
          <>
            <DropdownMenuItem>이 변경 사항 적용</DropdownMenuItem>
            <DropdownMenuItem>모두 적용</DropdownMenuItem>
          </>
        }>적용</RibbonSplitButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonSplitButton size="lg" icon={<XIcon className="h-6 w-6 text-status-danger" />} menuLabel="취소 옵션" menu={
          <>
            <DropdownMenuItem>이 변경 사항 취소</DropdownMenuItem>
            <DropdownMenuItem>모두 취소</DropdownMenuItem>
          </>
        }>취소</RibbonSplitButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" disabled icon={<ChevronLeft className="h-6 w-6" />}>이전</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" disabled icon={<ChevronRight className="h-6 w-6" />}>다음</RibbonButton>
      </RibbonGroup>
    </RibbonContent>
  );
}

/* ================================================================== *
 * AI 도구 — purely `lg` buttons with composite icons (badges, sparkles
 * overlay) signalling AI-powered actions. Mostly a showcase for
 * `OverlayIcon` patterns.
 * ================================================================== */

function AIToolsRibbon() {
  return (
    <RibbonContent value="ai">
      <RibbonGroup>
        <RibbonButton size="lg" icon={
          <OverlayIcon
            base={<MessageSquare className="h-6 w-6 text-label-neutral" />}
            overlay={<Sparkles className="h-3 w-3 absolute -top-1 -left-1 text-ai-normal" />}
          />
        }>NOVA{'\n'}AI 채팅</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={
          <OverlayIcon
            base={<Search className="h-6 w-6 text-label-neutral" />}
            overlay={<span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-polaris-pill bg-status-danger" aria-hidden="true" />}
          />
        }>웹{'\n'}검색</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={
          <OverlayIcon
            base={<FileText className="h-6 w-6 text-label-neutral" />}
            overlay={<Pencil className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-ai-normal" />}
          />
        }>AI{'\n'}Write</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={
          <OverlayIcon
            base={<Languages className="h-6 w-6 text-label-neutral" />}
            overlay={<span className="absolute -top-1 -right-1 h-2 w-2 rounded-polaris-pill bg-status-danger" aria-hidden="true" />}
          />
        }>번역</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Cloud className="h-6 w-6 text-label-neutral" />}>워드{'\n'}클라우드</RibbonButton>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonButton size="lg" icon={
          <OverlayIcon
            base={<Mic className="h-6 w-6 text-label-neutral" />}
            overlay={<Sparkles className="h-3 w-3 absolute -top-1 -left-1 text-ai-normal" />}
          />
        }>받아쓰기</RibbonButton>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonButton size="lg" icon={<ImagePlus className="h-6 w-6 text-label-neutral" />}>Text to{'\n'}Image</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Box className="h-6 w-6 text-label-neutral" />}>2D→3D{'\n'}변환</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Eraser2 className="h-6 w-6 text-label-neutral" />}>배경{'\n'}제거</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<ImageIcon className="h-6 w-6 text-label-neutral" />}>배경{'\n'}변경</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Wand2 className="h-6 w-6 text-label-neutral" />}>이미지{'\n'}리메이크</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<Maximize className="h-6 w-6 text-label-neutral" />}>이미지{'\n'}확장</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<ZoomIn className="h-6 w-6 text-label-neutral" />}>해상도{'\n'}향상</RibbonButton>
      </RibbonGroup>
      <RibbonGroup>
        <RibbonButton size="lg" icon={<PaletteIcon className="h-6 w-6 text-label-neutral" />}>스타일{'\n'}변환</RibbonButton>
      </RibbonGroup>
      <RibbonSeparator />
      <RibbonGroup>
        <RibbonButton size="lg" icon={<BookOpen className="h-6 w-6 text-ai-normal" />}>AI 도구{'\n'}사용자 가이드</RibbonButton>
      </RibbonGroup>
    </RibbonContent>
  );
}

function PlaceholderTab({ value, label }: { value: string; label: string }) {
  return (
    <RibbonContent value={value}>
      <div className="px-4 py-3 text-polaris-body-sm text-label-alternative">{label} (생략)</div>
    </RibbonContent>
  );
}

/* ================================================================== *
 * 파일 탭 — Office "backstage view". Unlike other tabs which render
 * controls inside the ribbon panel, the file tab takes over the full
 * window. Left drawer = sections; right pane = section content.
 * ================================================================== */

type FilePane = 'new' | 'open' | 'download' | 'save-drive' | 'share';

const FILE_NAV: Array<{ id: FilePane; label: string }> = [
  { id: 'new', label: '새 문서' },
  { id: 'open', label: '문서 열기' },
  { id: 'download', label: '다운로드' },
  { id: 'save-drive', label: '폴라리스 드라이브에 저장' },
  { id: 'share', label: '공유하기' },
];

function NewDocPane() {
  const docs: Array<{
    type: 'docx' | 'xlsx' | 'pptx';
    title: string;
    desc: string;
  }> = [
    { type: 'docx', title: '워드', desc: 'docx 확장자의 워드 문서를 만듭니다.' },
    { type: 'xlsx', title: '시트', desc: 'xlsx 확장자의 시트 문서를 만듭니다.' },
    { type: 'pptx', title: '슬라이드', desc: 'pptx 확장자의 슬라이드 문서를 만듭니다.' },
  ];
  return (
    <ul className="space-y-1">
      {docs.map((doc) => (
        <li key={doc.type}>
          <Button
            variant="ghost"
            className="!h-auto w-full !justify-start !py-3 !px-4 gap-4 rounded-polaris-md hover:bg-background-alternative text-left"
          >
            <FileIconBadge type={doc.type} size="md" />
            <span className="flex flex-col items-start min-w-0">
              <span className="text-polaris-body-sm font-semibold">{doc.title}</span>
              <span className="text-polaris-meta text-label-alternative truncate">{doc.desc}</span>
            </span>
          </Button>
        </li>
      ))}
    </ul>
  );
}

function OpenDocPane() {
  const places: Array<{ icon: LucideIcon; iconClass: string; label: string }> = [
    { icon: History, iconClass: 'text-label-alternative', label: '최근 문서' },
    { icon: Monitor, iconClass: 'text-label-alternative', label: '내 컴퓨터' },
    { icon: HardDrive, iconClass: 'text-primary-normal', label: '폴라리스 드라이브' },
    { icon: UsersRound, iconClass: 'text-status-success', label: '공유 문서' },
    { icon: Star, iconClass: 'text-status-warning fill-status-warning', label: '중요 문서' },
  ];
  return (
    <ul className="space-y-1">
      {places.map((place, idx) => {
        const Icon = place.icon;
        const active = idx === 0 || idx === 2; // demo: 최근 문서 + 폴라리스 드라이브 highlighted
        return (
          <li key={place.label}>
            <Button
              variant="ghost"
              className={cn(
                '!h-auto w-full !justify-start !py-3 !px-4 gap-3 rounded-polaris-md text-left',
                active ? 'bg-primary-normal-subtle hover:bg-primary-normal-subtle' : 'hover:bg-background-alternative'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', place.iconClass)} aria-hidden="true" />
              <span className="text-polaris-body-sm font-medium">{place.label}</span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function DownloadPane() {
  return (
    <div className="space-y-3 max-w-md">
      <p className="text-polaris-body-sm text-label-neutral">
        현재 문서를 로컬에 다운로드합니다. 형식을 선택하세요.
      </p>
      <ul className="space-y-1">
        {(['docx', 'pdf'] as const).map((type) => (
          <li key={type}>
            <Button
              variant="ghost"
              className="!h-auto w-full !justify-start !py-3 !px-4 gap-4 rounded-polaris-md hover:bg-background-alternative text-left"
            >
              <FileIconBadge type={type} size="md" />
              <span className="text-polaris-body-sm font-medium">
                {type.toUpperCase()}으로 다운로드
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SaveToDrivePane() {
  return (
    <div className="space-y-4 max-w-md">
      <p className="text-polaris-body-sm text-label-neutral">
        폴라리스 드라이브의 위치를 선택하세요. 변경 사항이 자동으로 동기화됩니다.
      </p>
      <Input label="파일 이름" defaultValue="NewDocument 2026-05-05 063559" />
      <div className="flex items-center gap-2 px-3 py-2 rounded-polaris-md border border-line-neutral bg-background-alternative text-polaris-body-sm">
        <FolderIcon className="h-4 w-4 text-label-alternative" aria-hidden="true" />
        <span className="text-label-neutral">/내 드라이브/문서</span>
      </div>
      <Button variant="primary" className="w-full">저장</Button>
    </div>
  );
}

function SharePane() {
  return (
    <div className="space-y-4 max-w-md">
      <p className="text-polaris-body-sm text-label-neutral">
        링크 또는 이메일로 다른 사람과 함께 편집할 수 있습니다.
      </p>
      <Input label="공유할 사람" placeholder="이메일 주소를 입력하세요" />
      <div className="flex items-center justify-between px-3 py-2.5 rounded-polaris-md border border-line-neutral">
        <div className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-label-alternative" aria-hidden="true" />
          <span className="text-polaris-body-sm">링크가 있는 모든 사람</span>
        </div>
        <Badge variant="neutral">보기 전용</Badge>
      </div>
      <Button variant="outline" className="w-full">링크 복사</Button>
    </div>
  );
}

function FileBackstage({ onClose }: { onClose: () => void }) {
  const [pane, setPane] = useState<FilePane>('new');
  const current = FILE_NAV.find((n) => n.id === pane);

  return (
    // EditorChrome 높이(h-12 = 48px)를 viewport에서 빼서 backstage가 정확히
    // 그 아래 영역을 차지하도록 inline style 사용. Tailwind 임의값(`h-[…]`)은
    // 폴라리스 lint 룰에 걸리므로 inline style이 더 깔끔.
    <div className="flex bg-background-normal" style={{ height: 'calc(100vh - 3rem)' }}>
      {/* Left drawer */}
      <aside className="w-60 shrink-0 border-r border-line-neutral bg-background-alternative flex flex-col">
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="문서로 돌아가기"
            className="!h-9 !w-9 !px-0"
          >
            <ArrowLeft className="h-5 w-5 text-primary-normal" />
          </Button>
        </div>
        <nav aria-label="파일 메뉴" className="px-2 pb-4">
          <ul className="space-y-0.5">
            {FILE_NAV.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => setPane(item.id)}
                  aria-current={pane === item.id ? 'page' : undefined}
                  className={cn(
                    'w-full !justify-start !px-3 !py-2 !h-auto rounded-polaris-md text-left text-polaris-body-sm font-normal',
                    pane === item.id
                      ? '!bg-background-alternative !font-semibold !text-label-normal'
                      : '!text-label-neutral hover:!bg-background-alternative'
                  )}
                >
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Right detail pane */}
      <main className="flex-1 px-8 py-6 overflow-y-auto">
        <h1 className="text-polaris-h4 mb-6 text-label-normal">{current?.label}</h1>
        {pane === 'new' && <NewDocPane />}
        {pane === 'open' && <OpenDocPane />}
        {pane === 'download' && <DownloadPane />}
        {pane === 'save-drive' && <SaveToDrivePane />}
        {pane === 'share' && <SharePane />}
      </main>
    </div>
  );
}

/* ================================================================== *
 * Main page — composes the chrome, the tabbed ribbon, and a canvas
 * placeholder. Only `activeTab` lives at this level; per-tab state is
 * encapsulated in each tab component.
 * ================================================================== */

export default function PolarisOffice() {
  const [activeTab, setActiveTab] = useState('home');

  // 파일 탭은 다른 탭과 달리 ribbon 영역이 아닌 backstage view로 화면을
  // 가져갑니다 (Office 패턴). EditorChrome은 유지하되 ribbon + canvas는
  // 숨기고 그 자리에 left drawer + right detail을 표시.
  if (activeTab === 'file') {
    return (
      <div className="bg-background-alternative">
        <EditorChrome />
        <FileBackstage onClose={() => setActiveTab('home')} />
      </div>
    );
  }

  return (
    <div className="bg-background-alternative">
      <EditorChrome />

      <Ribbon className="!border-b-2">
        <RibbonTabs value={activeTab} onValueChange={setActiveTab}>
          <RibbonTabList>
            <RibbonTab value="file">파일</RibbonTab>
            <RibbonTab value="home">홈</RibbonTab>
            <RibbonTab value="insert">삽입</RibbonTab>
            <RibbonTab value="layout">레이아웃</RibbonTab>
            <RibbonTab value="review">검토</RibbonTab>
            <RibbonTab value="view">보기</RibbonTab>
            <RibbonTab value="pen">펜</RibbonTab>
            <RibbonTab value="ai" className="relative pr-3">
              AI 도구
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-polaris-pill bg-status-danger" aria-hidden="true" />
            </RibbonTab>
            <span className="ml-auto inline-flex items-center pr-2">
              <Button variant="ghost" size="sm" aria-label="리본 접기" className="!h-8 !w-8 !px-0">
                <ChevronUp className="h-4 w-4 text-label-alternative" />
              </Button>
            </span>
          </RibbonTabList>

          <HomeRibbon />
          <InsertRibbon />
          <LayoutRibbon />
          <ReviewRibbon />
          <AIToolsRibbon />

          <PlaceholderTab value="file" label="파일 메뉴" />
          <PlaceholderTab value="view" label="보기 메뉴" />
          <PlaceholderTab value="pen" label="펜 메뉴" />
        </RibbonTabs>
      </Ribbon>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        <Card variant="padded">
          <div className="flex items-center gap-2 mb-4 text-polaris-meta text-label-alternative">
            <Badge variant="secondary">데모</Badge>
            현재 탭: {activeTab}
          </div>
          <h1 className="text-polaris-h2 mb-4 text-label-normal">
            폴라리스 오피스 리본 재현
          </h1>
          <p className="text-polaris-body text-label-neutral mb-2">
            이 화면은 <code className="font-polaris-mono text-polaris-body-sm bg-background-alternative px-1 rounded-polaris-sm">@polaris/ui/ribbon</code>의 컴포넌트만으로 구성된
            폴라리스 오피스 워드 에디터의 리본 메뉴 모형입니다.
          </p>
          <p className="text-polaris-body-sm text-label-alternative">
            상단의 탭(파일·홈·삽입·레이아웃·검토·보기·펜·AI 도구)을 클릭해 그룹과 컨트롤 구성을 확인할 수 있습니다.
            아이콘은 lucide-react의 best-effort 매칭이며, 폴라리스 토큰(`brand.*`, `status.*`, `fg.*`)만 사용해 색을 입혔습니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
