import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NovaInput } from '@polaris/ui';

const meta: Meta<typeof NovaInput> = {
  title: 'Polaris/NovaInput',
  component: NovaInput,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof NovaInput>;

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
      <NovaInput onSubmit={(v) => alert(v)} />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = useState('회의록 한 장 분량으로 요약해 줘');
    return (
      <div className="max-w-2xl">
        <NovaInput value={v} onChange={(e) => setV(e.target.value)} onSubmit={(x) => alert(x)} />
        <p className="mt-2 text-polaris-caption text-fg-muted">현재 값: {v}</p>
      </div>
    );
  },
};

export const NoIcon: Story = {
  render: () => (
    <div className="max-w-2xl">
      <NovaInput showIcon={false} placeholder="아이콘 없이" />
    </div>
  ),
};
