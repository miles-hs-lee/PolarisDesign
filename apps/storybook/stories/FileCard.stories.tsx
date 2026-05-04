import type { Meta, StoryObj } from '@storybook/react';
import { FileCard } from '@polaris/ui';
import { Badge } from '@polaris/ui';

const meta: Meta<typeof FileCard> = {
  title: 'Polaris/FileCard',
  component: FileCard,
  argTypes: {
    type: { control: 'select', options: ['docx', 'hwp', 'xlsx', 'pptx', 'pdf'] },
  },
  args: {
    type: 'docx',
    name: '원티드 하이파이브 스크립트.docx',
    meta: '2026/04/22 오전 11:06',
  },
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof FileCard>;

export const Default: Story = {};

export const WithTrailing: Story = {
  args: {
    type: 'hwp',
    name: '제안서_v1.0.hwp',
    trailing: <Badge variant="warning">검토 중</Badge>,
  },
};

export const Clickable: Story = {
  args: { onClick: () => alert('open') },
};

export const List: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
      <FileCard type="docx" name="원티드 하이파이브.docx" meta="2시간 전" />
      <FileCard type="xlsx" name="2026 핸디소프트 임원 평가.xlsx" meta="2026/02/03" />
      <FileCard type="pptx" name="월간경영회의_final.pptx" meta="2026/03/03" />
      <FileCard type="pdf" name="자료.pdf" meta="2025/12/09" />
      <FileCard type="hwp" name="제안서.hwp" meta="2026/02/14" trailing={<Badge variant="info">신규</Badge>} />
    </div>
  ),
};
