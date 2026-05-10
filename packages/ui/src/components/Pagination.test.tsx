import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Pagination,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationEllipsis,
  PaginationFooter,
  pageNumberItems,
  PAGE_ELLIPSIS,
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

describe('pageNumberItems()', () => {
  it('returns full sequence when total is small', () => {
    expect(pageNumberItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('inserts ellipses around the current page', () => {
    expect(pageNumberItems(7, 20)).toEqual([1, PAGE_ELLIPSIS, 5, 6, 7, 8, 9, PAGE_ELLIPSIS, 20]);
  });
});

describe('PaginationFooter', () => {
  it('renders the X-Y of N indicator', () => {
    render(
      <PaginationFooter page={2} pageSize={10} total={45} onPageChange={() => {}} />
    );
    expect(screen.getByText('11-20 / 45')).toBeInTheDocument();
  });

  it('hides total indicator when showTotal=false', () => {
    render(
      <PaginationFooter
        page={1}
        pageSize={10}
        total={20}
        showTotal={false}
        onPageChange={() => {}}
      />
    );
    expect(screen.queryByText('1-10 / 20')).not.toBeInTheDocument();
  });

  it('hides page-size selector when onPageSizeChange is omitted', () => {
    render(
      <PaginationFooter page={1} pageSize={10} total={20} onPageChange={() => {}} />
    );
    expect(screen.queryByText('페이지당')).not.toBeInTheDocument();
  });

  it('renders page-size selector when onPageSizeChange is provided', () => {
    render(
      <PaginationFooter
        page={1}
        pageSize={10}
        total={100}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    expect(screen.getByText('페이지당')).toBeInTheDocument();
  });

  it('fires onPageChange when a numbered button is clicked', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <PaginationFooter page={1} pageSize={10} total={50} onPageChange={onPageChange} />
    );
    await user.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables prev on page 1 and next on the last page', () => {
    const { unmount } = render(
      <PaginationFooter page={1} pageSize={10} total={20} onPageChange={() => {}} />
    );
    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeDisabled();
    unmount();

    render(<PaginationFooter page={2} pageSize={10} total={20} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeDisabled();
  });

  it('clamps an out-of-range page to the valid window', () => {
    render(
      <PaginationFooter page={99} pageSize={10} total={20} onPageChange={() => {}} />
    );
    expect(screen.getByText('11-20 / 20')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
  });

  it('showPageSize={false} hides the selector even with onPageSizeChange set', () => {
    render(
      <PaginationFooter
        page={1}
        pageSize={10}
        total={50}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        showPageSize={false}
      />
    );
    expect(screen.queryByText('페이지당')).toBeNull();
  });

  it('showPageSize={true} forces the selector visible (legacy behavior)', () => {
    render(
      <PaginationFooter
        page={1}
        pageSize={10}
        total={50}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        showPageSize
      />
    );
    expect(screen.getByText('페이지당')).toBeInTheDocument();
  });
});
