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
    expect(screen.getByText('만료').className).toMatch(/bg-status-danger/);
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
});
