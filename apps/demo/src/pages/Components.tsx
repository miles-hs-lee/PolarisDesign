import { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  FileIcon,
  FileCard,
  NovaInput,
} from '@polaris/ui';
import { Plus, Sparkles } from 'lucide-react';

type ToastEntry = { id: number; title: string; description?: string; variant: 'info' | 'success' | 'warning' | 'danger' };

export default function Components() {
  const [tab, setTab] = useState('overview');
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [novaQuery, setNovaQuery] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const pushToast = (variant: ToastEntry['variant'], title: string, description?: string) => {
    setToasts((t) => [...t, { id: Date.now() + Math.random(), title, description, variant }]);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-10 pb-4 border-b border-surface-border">
        <h1 className="text-polaris-heading-lg mb-1">Tier 0 Components</h1>
        <p className="text-polaris-body-sm text-text-muted">
          12개 컴포넌트의 variant·상태·조합을 한 페이지에서 검증
        </p>
      </header>

      <Section title="1. Button">
        <div className="flex flex-wrap gap-3 items-center">
          <Button>Primary</Button>
          <Button variant="secondary">
            <Sparkles className="h-4 w-4" /> Secondary (NOVA)
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center mt-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="md">
            <Plus className="h-4 w-4" /> 새 문서
          </Button>
        </div>
      </Section>

      <Section title="2. Input / Textarea">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="문서 제목" placeholder="제목을 입력하세요" hint="3자 이상" />
          <Input label="이메일" placeholder="you@polaris.com" type="email" error="유효하지 않은 형식입니다" />
          <Textarea label="설명" placeholder="설명을 입력하세요" containerClassName="md:col-span-2" />
        </div>
      </Section>

      <Section title="3. Card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>분기 보고서</CardTitle>
              <CardDescription>2026년 1분기 매출 및 비용 분석 자료</CardDescription>
            </CardHeader>
            <CardBody>
              <p className="text-polaris-body-sm text-text-secondary">
                NOVA가 자동 생성한 요약: 전 분기 대비 매출 12% 증가, 영업이익 8% 증가.
              </p>
            </CardBody>
            <CardFooter>
              <Button variant="outline" size="sm">취소</Button>
              <Button size="sm">열기</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>NOVA 추천 작업</CardTitle>
              <CardDescription>최근 활동 기반</CardDescription>
            </CardHeader>
            <CardBody>
              <ul className="space-y-1.5 text-polaris-body-sm text-text-secondary">
                <li>• 회의록을 한 장 분량으로 요약</li>
                <li>• 보고서 표지 이미지 생성</li>
                <li>• 영문 번역 초안 작성</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section title="4. Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>neutral</Badge>
          <Badge variant="primary">primary</Badge>
          <Badge variant="secondary"><Sparkles className="h-3 w-3" /> AI</Badge>
          <Badge variant="success">success</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="danger">danger</Badge>
          <Badge variant="info">info</Badge>
          <Badge variant="docx">DOCX</Badge>
          <Badge variant="xlsx">XLSX</Badge>
          <Badge variant="pptx">PPTX</Badge>
          <Badge variant="pdf">PDF</Badge>
          <Badge variant="hwp">HWP</Badge>
        </div>
      </Section>

      <Section title="5. Avatar">
        <div className="flex items-end gap-4">
          <Avatar size="sm"><AvatarFallback>김</AvatarFallback></Avatar>
          <Avatar size="md"><AvatarFallback>이</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback>박</AvatarFallback></Avatar>
          <Avatar size="xl"><AvatarFallback>최</AvatarFallback></Avatar>
          <Avatar size="md">
            <AvatarImage src="https://i.pravatar.cc/100" alt="example" />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        </div>
      </Section>

      <Section title="6. Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Dialog 열기</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>문서를 삭제하시겠습니까?</DialogTitle>
              <DialogDescription>
                이 작업은 되돌릴 수 없습니다. 문서가 휴지통으로 이동되며 30일 후 영구 삭제됩니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button variant="danger">삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="7. Toast">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => pushToast('info', '새 버전이 출시되었습니다', 'v1.4.0 — 자세히 보기')}>info</Button>
          <Button variant="outline" size="sm" onClick={() => pushToast('success', '저장이 완료되었습니다')}>success</Button>
          <Button variant="outline" size="sm" onClick={() => pushToast('warning', '변경사항이 저장되지 않았습니다')}>warning</Button>
          <Button variant="outline" size="sm" onClick={() => pushToast('danger', '파일 업로드 실패', '네트워크 오류로 다시 시도해 주세요')}>danger</Button>
        </div>
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant} duration={4000} onOpenChange={(open) => {
            if (!open) setToasts((s) => s.filter((x) => x.id !== t.id));
          }}>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <ToastTitle>{t.title}</ToastTitle>
              {t.description && <ToastDescription>{t.description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        ))}
      </Section>

      <Section title="8. Tabs">
        <Tabs value={tab} onValueChange={setTab} className="max-w-xl">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="files">파일</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card><CardBody>개요 탭 내용입니다.</CardBody></Card>
          </TabsContent>
          <TabsContent value="files">
            <Card><CardBody>파일 탭 내용입니다.</CardBody></Card>
          </TabsContent>
          <TabsContent value="ai">
            <Card><CardBody>AI 탭 내용입니다.</CardBody></Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="9. FileIcon (폴라리스 고유)">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <FileIcon type="docx" size="sm" />
            <span className="text-polaris-caption text-text-muted">sm</span>
          </div>
          {(['docx', 'xlsx', 'pptx', 'pdf', 'hwp'] as const).map((t) => (
            <div key={t} className="flex flex-col items-center gap-1">
              <FileIcon type={t} size="md" />
              <span className="text-polaris-caption text-text-muted">{t}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1">
            <FileIcon type="docx" size="lg" />
            <span className="text-polaris-caption text-text-muted">lg</span>
          </div>
        </div>
      </Section>

      <Section title="10. FileCard (폴라리스 고유)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FileCard type="docx" name="원티드 하이파이브 스크립트.docx" meta="2026/04/22 오전 11:06" onClick={() => pushToast('info', '문서를 열었습니다', '원티드 하이파이브 스크립트.docx')} />
          <FileCard type="xlsx" name="2026 핸디소프트 임원 평가.xlsx" meta="2026/02/03 오후 2:14" />
          <FileCard type="pptx" name="26년 03월 월간경영회의_final.pptx" meta="2026/03/03 오전 11:10" />
          <FileCard type="pdf" name="자료.pdf" meta="2025/12/09 오전 10:18" />
          <FileCard type="hwp" name="제안서_v1.0.hwp" meta="2026/02/14 오전 9:00" trailing={<Badge variant="warning">검토 중</Badge>} />
        </div>
      </Section>

      <Section title="11. NovaInput (폴라리스 고유)">
        <div className="max-w-2xl">
          <NovaInput
            value={novaQuery}
            onChange={(e) => setNovaQuery(e.target.value)}
            onSubmit={(v) => {
              setSubmitted(v);
              setNovaQuery('');
              pushToast('info', 'NOVA에게 요청을 보냈습니다', v.slice(0, 60));
            }}
          />
          {submitted && (
            <p className="text-polaris-caption text-text-muted mt-2">
              마지막 요청: <span className="text-text-primary">{submitted}</span>
            </p>
          )}
        </div>
      </Section>

      <Section title="12. 폴라리스 화면 모방 (조합 검증)">
        <Card>
          <CardHeader>
            <CardTitle>최근 문서</CardTitle>
            <CardDescription>NOVA를 통해 빠르게 작업을 시작하세요</CardDescription>
          </CardHeader>
          <CardBody>
            <NovaInput
              containerClassName="mb-4"
              onSubmit={(v) => pushToast('info', '요청 전송됨', v)}
            />
            <div className="space-y-2">
              <FileCard type="docx" name="2026 Q1 보고서.docx" meta="방금 전" />
              <FileCard type="xlsx" name="비용 정리.xlsx" meta="2시간 전" />
              <FileCard type="pdf" name="계약서.pdf" meta="어제" />
            </div>
          </CardBody>
        </Card>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-polaris-heading-md mb-4 text-text-primary">{title}</h2>
      {children}
    </section>
  );
}
