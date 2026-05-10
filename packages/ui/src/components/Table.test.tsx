import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './Table';

describe('Table — primitive', () => {
  it('renders a semantic table with rows + cells', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>홍길동</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '홍길동' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '이름' })).toBeInTheDocument();
  });
});

describe('TableHead — sortable', () => {
  it('renders a button when `sortable` is set', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable>이름</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('button', { name: /이름/ })).toBeInTheDocument();
  });

  it('does NOT render a button when `sortable` is unset', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('reflects sortDirection via aria-sort on the th', () => {
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={null}>
              이름
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              이름
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc">
              이름
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
  });

  it('cycles null → asc → desc → null on click via onSortChange', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={null} onSortChange={onSortChange}>
              이름
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    await user.click(screen.getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith('asc');

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc" onSortChange={onSortChange}>
              이름
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    await user.click(screen.getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith('desc');

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc" onSortChange={onSortChange}>
              이름
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    await user.click(screen.getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });

  it('honors a custom 2-state cycle', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              sortDirection="asc"
              onSortChange={onSortChange}
              cycle={['asc', 'desc']}
            >
              이름
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    await user.click(screen.getByRole('button'));
    // asc → next in [asc, desc] = desc (no null)
    expect(onSortChange).toHaveBeenCalledWith('desc');
  });
});
