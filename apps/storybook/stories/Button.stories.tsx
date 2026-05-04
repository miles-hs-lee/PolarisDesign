import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@polaris/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { children: '저장' },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: <><Sparkles className="h-4 w-4" /> NOVA에게 묻기</> },
};

export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', children: '삭제' } };

export const Loading: Story = { args: { loading: true, children: '저장 중...' } };
export const Disabled: Story = { args: { disabled: true } };

export const WithIcon: Story = {
  args: { children: <><Plus className="h-4 w-4" /> 새 문서</> },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};
