/**
 * Polaris Office editor ribbon recreation — uses @polaris/ui/ribbon to
 * rebuild the actual https://www.polarisoffice.com/editor/po/word ribbon
 * tab-by-tab. Icons are best-effort lucide-react matches; the structural
 * fidelity (tab order, group layout, button hierarchy, labels) is exact.
 */
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SimpleTooltip,
  DropdownMenuItem,
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
  RibbonButton,
  RibbonSplitButton,
  RibbonToggleGroup,
  RibbonToggleItem,
} from '@polaris/ui/ribbon';
import {
  Menu,
  Star,
  Save,
  ChevronDown,
  ChevronUp,
  Monitor,
  UsersRound,
  Bell,
  // home tab
  Clipboard,
  Scissors,
  Copy,
  Brush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  Type,
  Eraser,
  List,
  ListOrdered,
  ListTree,
  IndentDecrease,
  IndentIncrease,
  PaintBucket,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  WrapText,
  ChevronsUpDown,
  CornerDownLeft,
  Pilcrow,
  Pencil,
  Search,
  Replace,
  CaseSensitive,
  ArrowLeftRight,
  AArrowUp,
  AArrowDown,
  SquareUser,
  // insert tab
  FilePlus,
  SeparatorHorizontal,
  Table,
  Image as ImageIcon,
  Globe,
  Shapes,
  Link as LinkIcon,
  Bookmark,
  TextCursorInput,
  Sigma,
  // layout tab
  Columns3,
  RotateCw,
  Maximize2,
  SplitSquareVertical,
  Settings,
  Layout as LayoutIcon,
  Move,
  Group,
  ArrowUpToLine,
  ArrowDownToLine,
  AlignVerticalSpaceBetween,
  // review tab
  Check,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  MessageSquare,
  History,
  ListChecks,
  // AI tab
  Sparkles,
  Languages,
  Cloud,
  Mic,
  ImagePlus,
  Box,
  Eraser as Eraser2,
  Wand2,
  Maximize,
  ZoomIn,
  Palette as PaletteIcon,
  BookOpen,
  FileText,
} from 'lucide-react';

export default function PolarisOffice() {
  const [activeTab, setActiveTab] = useState('home');

  // Home tab state
  const [marks, setMarks] = useState<string[]>(['bold']);
  const [align, setAlign] = useState('justify');
  const [fontFamily, setFontFamily] = useState('나눔바른고딕');
  const [fontSize, setFontSize] = useState('10');

  // Review tab state
  const [trackChanges, setTrackChanges] = useState<string[]>(['track']);
  const [reviewView, setReviewView] = useState('all');

  return (
    <div className="bg-surface-canvas">
      {/* === Top bar (mimics editor chrome) === */}
      <div className="flex items-center gap-2 h-12 px-3 border-b border-surface-border bg-surface-raised">
        <Button variant="ghost" size="sm" aria-label="Menu" className="!h-9 !w-9 !px-0">
          <Menu className="h-5 w-5 text-brand-primary" />
        </Button>
        <div className="flex items-center gap-1.5 text-polaris-body-sm">
          <span>NewDocument 2026-05-05 063559.docx</span>
          <ChevronDown className="h-4 w-4 text-fg-muted" aria-hidden="true" />
        </div>
        <Button variant="ghost" size="sm" aria-label="즐겨찾기" className="!h-8 !w-8 !px-0 ml-1">
          <Star className="h-4 w-4 text-fg-muted" />
        </Button>
        <SimpleTooltip label="저장됨">
          <Button variant="ghost" size="sm" aria-label="저장" className="!h-8 !w-8 !px-0">
            <Save className="h-4 w-4 text-brand-primary" />
          </Button>
        </SimpleTooltip>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Monitor className="h-4 w-4" aria-hidden="true" />
            <span className="font-semibold">PC 앱으로 열기</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <UsersRound className="h-4 w-4" aria-hidden="true" />
            <span>공유</span>
          </Button>
          <Button variant="ghost" size="sm" aria-label="알림" className="gap-1.5">
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span>알림</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Avatar size="sm">
              <AvatarFallback>이</AvatarFallback>
            </Avatar>
            <span>Miles (이해석)</span>
          </Button>
        </div>
      </div>

      {/* === Ribbon === */}
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
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-polaris-full bg-status-danger" aria-hidden="true" />
            </RibbonTab>
            <span className="ml-auto inline-flex items-center pr-2">
              <Button variant="ghost" size="sm" aria-label="리본 접기" className="!h-8 !w-8 !px-0">
                <ChevronUp className="h-4 w-4 text-fg-muted" />
              </Button>
            </span>
          </RibbonTabList>

          {/* === 홈 === */}
          <RibbonContent value="home">
            <RibbonGroup label="붙여넣기">
              <RibbonSplitButton
                size="lg"
                icon={<Clipboard className="h-6 w-6 text-brand-primary" />}
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

            <RibbonGroup>
              <RibbonStack>
                <RibbonRow>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="!h-6 w-36 text-polaris-body-sm">
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
                    <SelectTrigger className="!h-6 w-14 ml-0.5 text-polaris-body-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['8', '9', '10', '11', '12', '14', '16', '18', '20', '24'].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <RibbonButton tooltip="글자 크게" icon={<AArrowUp className="h-4 w-4" />} />
                  <RibbonButton tooltip="글자 작게" icon={<AArrowDown className="h-4 w-4" />} />
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
                  <RibbonButton tooltip="아래 첨자" icon={<Subscript className="h-4 w-4" />} />
                  <RibbonButton tooltip="위 첨자" icon={<Superscript className="h-4 w-4" />} />
                  <RibbonButton tooltip="글자 색" icon={
                    <span className="flex flex-col items-center leading-none">
                      <Type className="h-3 w-3" />
                      <span className="block w-3 h-0.5 bg-status-danger mt-0.5" />
                    </span>
                  } />
                  <RibbonButton tooltip="형광펜" icon={
                    <span className="flex flex-col items-center leading-none">
                      <Highlighter className="h-3 w-3 text-status-warning" />
                      <span className="block w-3 h-0.5 bg-status-warning mt-0.5" />
                    </span>
                  } />
                  <RibbonButton tooltip="문자 강조 표시" icon={<SquareUser className="h-4 w-4" />} />
                  <RibbonButton tooltip="문자 테두리" icon={<span className="inline-flex h-4 w-4 items-center justify-center border-2 border-fg-primary rounded-polaris-sm text-polaris-caption font-bold leading-none">A</span>} />
                  <RibbonButton tooltip="서식 지우기" icon={<Eraser className="h-4 w-4" />} />
                </RibbonRow>
              </RibbonStack>
            </RibbonGroup>

            <RibbonSeparator />

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

            <RibbonGroup>
              <RibbonRow>
                <RibbonSplitButton tooltip="채우기 색" icon={<PaintBucket className="h-4 w-4" />} menuLabel="채우기 색" menu={<DropdownMenuItem>색 선택…</DropdownMenuItem>} />
                <RibbonSplitButton tooltip="문자 간격" icon={<ArrowLeftRight className="h-4 w-4" />} menuLabel="문자 간격" menu={<DropdownMenuItem>좁게 / 보통 / 넓게</DropdownMenuItem>} />
              </RibbonRow>
            </RibbonGroup>

            <RibbonSeparator />

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

            <RibbonGroup label="스타일">
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

          {/* === 삽입 === */}
          <RibbonContent value="insert">
            <RibbonGroup>
              <RibbonButton size="lg" icon={<FilePlus className="h-6 w-6 text-fg-secondary" />}>새{'\n'}페이지</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<SeparatorHorizontal className="h-6 w-6 text-status-danger" />}>페이지{'\n'}나누기</RibbonButton>
            </RibbonGroup>
            <RibbonSeparator />
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Table className="h-6 w-6 text-fg-secondary" />}>표</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<ImageIcon className="h-6 w-6 text-status-success" />}>그림</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={
                <span className="relative inline-flex">
                  <ImageIcon className="h-6 w-6 text-status-success" />
                  <Globe className="h-3 w-3 absolute -bottom-1 -right-1 text-brand-primary bg-surface-raised rounded-polaris-full" />
                </span>
              }>온라인{'\n'}그림</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" icon={<Shapes className="h-6 w-6 text-fg-secondary" />} menuLabel="도형 선택" menu={
                <>
                  <DropdownMenuItem>사각형</DropdownMenuItem>
                  <DropdownMenuItem>원</DropdownMenuItem>
                  <DropdownMenuItem>화살표</DropdownMenuItem>
                </>
              }>도형</RibbonSplitButton>
            </RibbonGroup>
            <RibbonSeparator />
            <RibbonGroup>
              <RibbonButton size="lg" icon={<LinkIcon className="h-6 w-6 text-fg-secondary" />}>하이퍼{'\n'}링크</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={
                <span className="relative inline-flex">
                  <Bookmark className="h-6 w-6 text-fg-secondary" />
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-1 bg-status-danger" aria-hidden="true" />
                </span>
              }>책갈피</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" icon={<TextCursorInput className="h-6 w-6 text-fg-secondary" />} menuLabel="텍스트 상자 종류" menu={
                <>
                  <DropdownMenuItem>가로 텍스트 상자</DropdownMenuItem>
                  <DropdownMenuItem>세로 텍스트 상자</DropdownMenuItem>
                </>
              }>텍스트{'\n'}상자</RibbonSplitButton>
            </RibbonGroup>
            <RibbonSeparator />
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Sigma className="h-6 w-6 text-fg-secondary" />}>기호</RibbonButton>
            </RibbonGroup>
          </RibbonContent>

          {/* === 레이아웃 === */}
          <RibbonContent value="layout">
            <RibbonGroup>
              <RibbonSplitButton size="lg" icon={<LayoutIcon className="h-6 w-6 text-fg-secondary" />} menuLabel="여백 선택" menu={<DropdownMenuItem>좁게 / 보통 / 넓게</DropdownMenuItem>}>여백</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" icon={<RotateCw className="h-6 w-6 text-fg-secondary" />} menuLabel="용지 방향" menu={<><DropdownMenuItem>세로</DropdownMenuItem><DropdownMenuItem>가로</DropdownMenuItem></>}>용지{'\n'}방향</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" icon={<Maximize2 className="h-6 w-6 text-fg-secondary" />} menuLabel="용지 크기" menu={<><DropdownMenuItem>A4</DropdownMenuItem><DropdownMenuItem>Letter</DropdownMenuItem></>}>크기</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" icon={<Columns3 className="h-6 w-6 text-fg-secondary" />} menuLabel="단 나누기" menu={<><DropdownMenuItem>1단</DropdownMenuItem><DropdownMenuItem>2단</DropdownMenuItem><DropdownMenuItem>3단</DropdownMenuItem></>}>단</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" icon={<SplitSquareVertical className="h-6 w-6 text-status-danger" />} menuLabel="페이지/단/구역 나누기" menu={<><DropdownMenuItem>페이지 나누기</DropdownMenuItem><DropdownMenuItem>단 나누기</DropdownMenuItem><DropdownMenuItem>구역 나누기</DropdownMenuItem></>}>나누기</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Settings className="h-6 w-6 text-brand-primary" />}>페이지{'\n'}설정</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Settings className="h-6 w-6 text-brand-primary" />}>레이아웃{'\n'}설정</RibbonButton>
            </RibbonGroup>
            <RibbonSeparator />
            {/* Image-related — disabled until selection */}
            <RibbonGroup>
              <RibbonSplitButton size="lg" disabled icon={<Move className="h-6 w-6" />} menuLabel="위치" menu={<DropdownMenuItem>위치 선택</DropdownMenuItem>}>위치</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" disabled icon={<WrapText className="h-6 w-6" />} menuLabel="줄 바꿈 옵션" menu={<DropdownMenuItem>옵션</DropdownMenuItem>}>텍스트{'\n'}줄 바꿈</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" disabled icon={<Group className="h-6 w-6" />} menuLabel="그룹" menu={<DropdownMenuItem>그룹/해제</DropdownMenuItem>}>그룹</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" disabled icon={<ArrowUpToLine className="h-6 w-6" />} menuLabel="앞으로" menu={<DropdownMenuItem>맨 앞으로</DropdownMenuItem>}>앞으로{'\n'}가져오기</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" disabled icon={<ArrowDownToLine className="h-6 w-6" />} menuLabel="뒤로" menu={<DropdownMenuItem>맨 뒤로</DropdownMenuItem>}>뒤로{'\n'}보내기</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" disabled icon={<AlignLeft className="h-6 w-6" />} menuLabel="맞춤" menu={<DropdownMenuItem>왼쪽/오른쪽/위/아래</DropdownMenuItem>}>맞춤</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonSplitButton size="lg" disabled icon={<RotateCw className="h-6 w-6" />} menuLabel="회전" menu={<><DropdownMenuItem>90° 회전</DropdownMenuItem><DropdownMenuItem>180° 회전</DropdownMenuItem></>}>회전</RibbonSplitButton>
            </RibbonGroup>
          </RibbonContent>

          {/* === 검토 === */}
          <RibbonContent value="review">
            <RibbonGroup>
              <RibbonButton size="lg" icon={<span className="text-polaris-caption font-bold leading-tight text-center">ABC{'\n'}123</span>}>단어{'\n'}개수</RibbonButton>
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
              <RibbonSplitButton size="lg" icon={<ListChecks className="h-6 w-6 text-fg-secondary" />} menuLabel="변경내용 표시 옵션" menu={
                <>
                  <DropdownMenuItem>모든 변경 사항</DropdownMenuItem>
                  <DropdownMenuItem>최종본</DropdownMenuItem>
                  <DropdownMenuItem>원본</DropdownMenuItem>
                </>
              }>변경내용{'\n'}표시</RibbonSplitButton>
            </RibbonGroup>
            <RibbonGroup>
              <Select value={reviewView} onValueChange={setReviewView}>
                <SelectTrigger className="!h-8 w-44 text-polaris-body-sm">
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

          {/* === AI 도구 === */}
          <RibbonContent value="ai">
            <RibbonGroup>
              <RibbonButton size="lg" icon={
                <span className="relative inline-flex">
                  <MessageSquare className="h-6 w-6 text-fg-secondary" />
                  <Sparkles className="h-3 w-3 absolute -top-1 -left-1 text-brand-secondary" />
                </span>
              }>NOVA{'\n'}AI 채팅</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={
                <span className="relative inline-flex">
                  <Search className="h-6 w-6 text-fg-secondary" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-polaris-full bg-status-danger" aria-hidden="true" />
                </span>
              }>웹{'\n'}검색</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={
                <span className="relative inline-flex">
                  <FileText className="h-6 w-6 text-fg-secondary" />
                  <Pencil className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-brand-secondary" />
                </span>
              }>AI{'\n'}Write</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={
                <span className="relative inline-flex">
                  <Languages className="h-6 w-6 text-fg-secondary" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-polaris-full bg-status-danger" aria-hidden="true" />
                </span>
              }>번역</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Cloud className="h-6 w-6 text-fg-secondary" />}>워드{'\n'}클라우드</RibbonButton>
            </RibbonGroup>
            <RibbonSeparator />
            <RibbonGroup>
              <RibbonButton size="lg" icon={
                <span className="relative inline-flex">
                  <Mic className="h-6 w-6 text-fg-secondary" />
                  <Sparkles className="h-3 w-3 absolute -top-1 -left-1 text-brand-secondary" />
                </span>
              }>받아쓰기</RibbonButton>
            </RibbonGroup>
            <RibbonSeparator />
            <RibbonGroup>
              <RibbonButton size="lg" icon={<ImagePlus className="h-6 w-6 text-fg-secondary" />}>Text to{'\n'}Image</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Box className="h-6 w-6 text-fg-secondary" />}>2D→3D{'\n'}변환</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Eraser2 className="h-6 w-6 text-fg-secondary" />}>배경{'\n'}제거</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<ImageIcon className="h-6 w-6 text-fg-secondary" />}>배경{'\n'}변경</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Wand2 className="h-6 w-6 text-fg-secondary" />}>이미지{'\n'}리메이크</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<Maximize className="h-6 w-6 text-fg-secondary" />}>이미지{'\n'}확장</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<ZoomIn className="h-6 w-6 text-fg-secondary" />}>해상도{'\n'}향상</RibbonButton>
            </RibbonGroup>
            <RibbonGroup>
              <RibbonButton size="lg" icon={<PaletteIcon className="h-6 w-6 text-fg-secondary" />}>스타일{'\n'}변환</RibbonButton>
            </RibbonGroup>
            <RibbonSeparator />
            <RibbonGroup>
              <RibbonButton size="lg" icon={<BookOpen className="h-6 w-6 text-brand-secondary" />}>AI 도구{'\n'}사용자 가이드</RibbonButton>
            </RibbonGroup>
          </RibbonContent>

          {/* placeholders for tabs we don't fully implement */}
          <RibbonContent value="file">
            <div className="px-4 py-3 text-polaris-body-sm text-fg-muted">파일 메뉴 (생략)</div>
          </RibbonContent>
          <RibbonContent value="view">
            <div className="px-4 py-3 text-polaris-body-sm text-fg-muted">보기 메뉴 (생략)</div>
          </RibbonContent>
          <RibbonContent value="pen">
            <div className="px-4 py-3 text-polaris-body-sm text-fg-muted">펜 메뉴 (생략)</div>
          </RibbonContent>
        </RibbonTabs>
      </Ribbon>

      {/* === Editor canvas placeholder === */}
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <Card variant="padded" className="min-h-96">
          <div className="flex items-center gap-2 mb-4 text-polaris-caption text-fg-muted">
            <Badge variant="secondary">데모</Badge>
            현재 탭: {activeTab}
          </div>
          <h1 className="text-polaris-display-md mb-4 text-fg-primary">
            폴라리스 오피스 리본 재현
          </h1>
          <p className="text-polaris-body-lg text-fg-secondary mb-2">
            이 화면은 <code className="font-polaris-mono text-polaris-body-sm bg-surface-sunken px-1 rounded-polaris-sm">@polaris/ui/ribbon</code>의 컴포넌트만으로 구성된
            폴라리스 오피스 워드 에디터의 리본 메뉴 모형입니다.
          </p>
          <p className="text-polaris-body-sm text-fg-muted">
            상단의 탭(파일·홈·삽입·레이아웃·검토·보기·펜·AI 도구)을 클릭해 그룹과 컨트롤 구성을 확인할 수 있습니다.
            아이콘은 lucide-react의 best-effort 매칭이며, 폴라리스 토큰(`brand.*`, `status.*`, `fg.*`)만 사용해 색을 입혔습니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
