import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Disclosure,
  DisclosureRoot,
  DisclosureTrigger,
  DisclosureContent,
} from './Disclosure';

describe('Disclosure', () => {
  it('renders title in trigger and hides content by default', () => {
    render(
      <Disclosure title="고급 설정">
        <p>세부 옵션</p>
      </Disclosure>
    );
    expect(screen.getByRole('button', { name: '고급 설정' })).toBeInTheDocument();
    expect(screen.queryByText('세부 옵션')).not.toBeInTheDocument();
  });

  it('toggles content on click and updates aria-expanded', async () => {
    const user = userEvent.setup();
    render(
      <Disclosure title="t">
        <p>body</p>
      </Disclosure>
    );
    const trigger = screen.getByRole('button', { name: 't' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('starts open when defaultOpen is set', () => {
    render(
      <Disclosure title="t" defaultOpen>
        <p>body</p>
      </Disclosure>
    );
    expect(screen.getByRole('button', { name: 't' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('respects controlled open prop', async () => {
    const user = userEvent.setup();
    const handleChange = (() => {}) as (o: boolean) => void;
    render(
      <Disclosure title="t" open onOpenChange={handleChange}>
        <p>body</p>
      </Disclosure>
    );
    expect(screen.getByText('body')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    // External state hasn't flipped, so still open.
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('hides chevron icon when hideChevron=true', () => {
    const { container } = render(
      <Disclosure title="t" hideChevron>
        <p>body</p>
      </Disclosure>
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('compound API works for custom triggers', async () => {
    const user = userEvent.setup();
    render(
      <DisclosureRoot>
        <DisclosureTrigger>커스텀</DisclosureTrigger>
        <DisclosureContent>세부</DisclosureContent>
      </DisclosureRoot>
    );
    await user.click(screen.getByRole('button', { name: '커스텀' }));
    expect(screen.getByText('세부')).toBeInTheDocument();
  });
});
