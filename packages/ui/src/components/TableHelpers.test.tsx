import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import {
  TableSearchInput,
  TableToolbar,
  TableSelectionBar,
  TableSkeleton,
  type TableFilterChip,
} from './TableHelpers';

describe('TableSearchInput', () => {
  it('fires onValueChange immediately when no debounce', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<TableSearchInput value="" onValueChange={onValueChange} placeholder="검색" />);
    await user.type(screen.getByRole('searchbox'), 'a');
    expect(onValueChange).toHaveBeenLastCalledWith('a');
  });

  it('shows clear button only when there is a value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <TableSearchInput value="" onValueChange={onValueChange} />
    );
    expect(screen.queryByRole('button', { name: '검색어 지우기' })).toBeNull();

    rerender(<TableSearchInput value="abc" onValueChange={onValueChange} />);
    const clear = screen.getByRole('button', { name: '검색어 지우기' });
    await user.click(clear);
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });
});

describe('TableToolbar', () => {
  it('hides search input when search prop omitted', () => {
    render(<TableToolbar />);
    expect(screen.queryByRole('searchbox')).toBeNull();
  });

  it('renders search + actions slot', () => {
    render(
      <TableToolbar
        search=""
        onSearchChange={() => {}}
        searchPlaceholder="이름"
        actions={<Button>+ 추가</Button>}
      />
    );
    expect(screen.getByRole('searchbox', { name: '이름' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ 추가' })).toBeInTheDocument();
  });

  it('renders chips with active state and fires onChipChange', async () => {
    const user = userEvent.setup();
    const onChipChange = vi.fn();
    const chips: TableFilterChip[] = [
      { value: 'all', label: '전체', count: 240 },
      { value: 'active', label: '활성', count: 198 },
    ];
    render(
      <TableToolbar
        chips={chips}
        activeChip="all"
        onChipChange={onChipChange}
      />
    );
    expect(screen.getByRole('button', { name: /전체/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /활성/ })).toHaveAttribute('aria-pressed', 'false');
    await user.click(screen.getByRole('button', { name: /활성/ }));
    expect(onChipChange).toHaveBeenCalledWith('active');
  });

  it('chip count badge renders when provided', () => {
    render(
      <TableToolbar
        chips={[{ value: 'a', label: '활성', count: 12 }]}
        activeChip="a"
      />
    );
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});

describe('TableSelectionBar', () => {
  it('renders the selected count and actions', () => {
    render(
      <TableSelectionBar
        count={3}
        actions={<Button size="sm">삭제</Button>}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('3개 선택됨')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '선택 해제' })).toBeInTheDocument();
  });

  it('fires onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<TableSelectionBar count={1} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: '선택 해제' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('honors labels.selected for i18n', () => {
    render(
      <TableSelectionBar
        count={2}
        labels={{ selected: (n) => `${n} selected` }}
      />
    );
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });
});

describe('TableSkeleton', () => {
  it('renders the requested number of rows × columns', () => {
    const { container } = render(<TableSkeleton rows={3} columns={4} />);
    // Each row has `columns` placeholder bars + 1 header row of `columns` bars (3+1=4 rows).
    const rows = container.querySelectorAll('[role="status"] > div')[1];
    expect(rows?.children.length).toBe(3);
  });

  it('omits the header row when showHeader=false', () => {
    const { container } = render(<TableSkeleton rows={2} columns={3} showHeader={false} />);
    // Without header, the only inner div is the data row container.
    const inner = container.querySelector('[role="status"]') as HTMLElement;
    expect(inner.children.length).toBe(2); // [rowsContainer, srOnly]
  });

  it('exposes ARIA loading state', () => {
    render(<TableSkeleton />);
    const region = screen.getByRole('status', { name: '테이블 로딩 중' });
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });
});
