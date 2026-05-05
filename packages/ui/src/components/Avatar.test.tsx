import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback } from './Avatar';

describe('Avatar', () => {
  it('renders fallback when no image is provided', () => {
    render(
      <Avatar>
        <AvatarFallback>이</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('이')).toBeInTheDocument();
  });

  it('applies size classes (sm/md/lg)', () => {
    const { container, rerender } = render(
      <Avatar size="sm">
        <AvatarFallback>x</AvatarFallback>
      </Avatar>
    );
    expect(container.firstChild).toHaveClass('h-7');
    rerender(
      <Avatar size="lg">
        <AvatarFallback>x</AvatarFallback>
      </Avatar>
    );
    expect(container.firstChild).toHaveClass('h-11');
  });
});
