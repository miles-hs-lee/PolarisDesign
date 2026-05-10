import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders text content', () => {
    render(<Badge>NEW</Badge>);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('applies neutral subtle variant by default', () => {
    render(<Badge>x</Badge>);
    expect(screen.getByText('x')).toHaveClass('bg-neutral-100');
  });

  it('uses subtle tone by default', () => {
    render(<Badge variant="danger">만료</Badge>);
    // tone=subtle (default) for danger uses /15 alpha background
    expect(screen.getByText('만료').className).toMatch(/bg-state-error/);
  });

  it('applies solid tone classes when tone="solid"', () => {
    render(
      <Badge variant="primary" tone="solid">
        new
      </Badge>
    );
    expect(screen.getByText('new')).toHaveClass('bg-accent-brand-normal');
    expect(screen.getByText('new')).toHaveClass('text-label-inverse');
  });

  it('applies outline tone classes when tone="outline"', () => {
    render(
      <Badge variant="danger" tone="outline">
        정책 위반
      </Badge>
    );
    const el = screen.getByText('정책 위반');
    // Transparent bg + 1px border + colored text/border.
    expect(el).toHaveClass('bg-transparent');
    expect(el).toHaveClass('border');
    expect(el).toHaveClass('border-state-error');
    expect(el).toHaveClass('text-state-error');
  });

  it('outline tone applies neutral border-strong for neutral variant', () => {
    render(
      <Badge variant="neutral" tone="outline">
        초안
      </Badge>
    );
    expect(screen.getByText('초안')).toHaveClass('border-line-strong');
  });
});
