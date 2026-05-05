import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Pagination,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationEllipsis,
} from './Pagination';

describe('Pagination', () => {
  it('renders with proper nav landmark and aria-label', () => {
    render(
      <Pagination>
        <PaginationItem active>1</PaginationItem>
      </Pagination>
    );
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });

  it('marks the active page with aria-current', () => {
    render(
      <Pagination>
        <PaginationItem>1</PaginationItem>
        <PaginationItem active>2</PaginationItem>
        <PaginationItem>3</PaginationItem>
      </Pagination>
    );
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '1' })).not.toHaveAttribute('aria-current');
  });

  it('fires onClick on item click', async () => {
    const onClick = vi.fn();
    render(
      <Pagination>
        <PaginationItem onClick={onClick}>1</PaginationItem>
      </Pagination>
    );
    await userEvent.click(screen.getByRole('button', { name: '1' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('PaginationPrev and Next render with directional aria labels', () => {
    render(
      <Pagination>
        <PaginationPrev />
        <PaginationNext />
      </Pagination>
    );
    expect(screen.getByRole('button', { name: /prev|이전/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next|다음/i })).toBeInTheDocument();
  });

  it('PaginationEllipsis renders as a non-interactive span', () => {
    const { container } = render(
      <Pagination>
        <PaginationEllipsis />
      </Pagination>
    );
    // ellipsis should not be a button
    expect(container.querySelector('button')).toBeNull();
  });
});
