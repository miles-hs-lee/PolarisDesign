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

describe('TableRow — clickable a11y', () => {
  it('clickable + onClick: tabIndex=0 + Enter/Space fire onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Table>
        <TableBody>
          <TableRow clickable onClick={onClick} data-testid="row">
            <TableCell>홍길동</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveAttribute('tabindex', '0');

    row.focus();
    expect(document.activeElement).toBe(row);
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('clickable WITHOUT onClick: no tabIndex (purely visual)', () => {
    render(
      <Table>
        <TableBody>
          <TableRow clickable data-testid="row">
            <TableCell>cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByTestId('row')).not.toHaveAttribute('tabindex');
  });

  it('row keyboard handler does NOT fire an EXTRA onClick when focus is on a child', async () => {
    // Pressing Enter on an inner <button> still bubbles a click to the
    // row (that's normal React event delegation). The guarantee we
    // want is that our row keyboard handler doesn't ALSO call onClick
    // on top of that — i.e. exactly 1 invocation, not 2.
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <Table>
        <TableBody>
          <TableRow clickable onClick={onRowClick} data-testid="row">
            <TableCell>
              <button type="button">액션</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    screen.getByRole('button', { name: '액션' }).focus();
    await user.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });
});
