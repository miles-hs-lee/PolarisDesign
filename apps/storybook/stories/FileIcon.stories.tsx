import type { Meta, StoryObj } from '@storybook/react';
import { FileIcon } from '@polaris/ui';

const meta: Meta<typeof FileIcon> = {
  title: 'Polaris/FileIcon',
  component: FileIcon,
  argTypes: {
    type: { control: 'select', options: ['docx', 'hwp', 'xlsx', 'pptx', 'pdf'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { type: 'docx', size: 'md' },
};
export default meta;
type Story = StoryObj<typeof FileIcon>;

export const Default: Story = {};

export const AllTypes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['docx', 'hwp', 'xlsx', 'pptx', 'pdf'] as const).map((t) => (
        <FileIcon key={t} type={t} />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <FileIcon type="docx" size="sm" />
      <FileIcon type="docx" size="md" />
      <FileIcon type="docx" size="lg" />
    </div>
  ),
};
