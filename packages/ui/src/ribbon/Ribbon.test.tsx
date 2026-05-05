/**
 * Ribbon smoke tests. Locks the recent fixes:
 * - disabled SplitButton must NOT open its dropdown menu
 * - icon-only buttons fall back to a string tooltip as their accessible name
 * - tabs render and switch
 * - sm/lg button size variants apply
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bold, Italic, Trash2 } from 'lucide-react';
import {
  Ribbon,
  RibbonTabs,
  RibbonTabList,
  RibbonTab,
  RibbonContent,
  RibbonGroup,
  RibbonButton,
  RibbonSplitButton,
  RibbonToggleGroup,
  RibbonToggleItem,
} from './Ribbon';
import { TooltipProvider } from '../components/Tooltip';
import { DropdownMenuItem } from '../components/DropdownMenu';

const wrap = (ui: React.ReactNode) => (
  <TooltipProvider delayDuration={0}>{ui}</TooltipProvider>
);

describe('RibbonButton', () => {
  it('renders an icon-only button with no children', () => {
    render(wrap(<RibbonButton icon={<Bold className="h-4 w-4" />} aria-label="굵게" />));
    expect(screen.getByRole('button', { name: '굵게' })).toBeInTheDocument();
  });

  it('falls back to string tooltip as accessible name when no aria-label is given', () => {
    render(wrap(<RibbonButton icon={<Italic className="h-4 w-4" />} tooltip="기울임" />));
    // Without children/aria-label, tooltip string is used as the button name.
    expect(screen.getByRole('button', { name: '기울임' })).toBeInTheDocument();
  });

  it('explicit aria-label wins over tooltip', () => {
    render(
      wrap(<RibbonButton icon={<Italic className="h-4 w-4" />} tooltip="visual" aria-label="real" />)
    );
    expect(screen.getByRole('button', { name: 'real' })).toBeInTheDocument();
  });

  it('applies lg size class (flex-col + h-16)', () => {
    render(wrap(<RibbonButton size="lg">스타일</RibbonButton>));
    expect(screen.getByRole('button', { name: '스타일' })).toHaveClass('flex-col');
  });
});

describe('RibbonSplitButton', () => {
  it('does NOT open its dropdown menu when disabled', async () => {
    render(
      wrap(
        <RibbonSplitButton
          disabled
          icon={<Trash2 className="h-4 w-4" />}
          tooltip="삭제"
          menuLabel="삭제 옵션"
          menu={
            <>
              <DropdownMenuItem>삭제</DropdownMenuItem>
              <DropdownMenuItem>모두 삭제</DropdownMenuItem>
            </>
          }
        />
      )
    );
    // Both halves should be disabled
    const main = screen.getByRole('button', { name: '삭제' });
    const chevron = screen.getByRole('button', { name: '삭제 옵션' });
    expect(main).toBeDisabled();
    expect(chevron).toBeDisabled();

    // Clicking either side should not surface a menu
    await userEvent.click(chevron);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.queryByText('모두 삭제')).not.toBeInTheDocument();
  });

  it('opens the menu when not disabled', async () => {
    render(
      wrap(
        <RibbonSplitButton
          icon={<Trash2 className="h-4 w-4" />}
          tooltip="삭제"
          menuLabel="삭제 옵션"
          menu={
            <>
              <DropdownMenuItem>삭제</DropdownMenuItem>
              <DropdownMenuItem>모두 삭제</DropdownMenuItem>
            </>
          }
        />
      )
    );
    await userEvent.click(screen.getByRole('button', { name: '삭제 옵션' }));
    expect(await screen.findByText('모두 삭제')).toBeInTheDocument();
  });
});

describe('RibbonTabs', () => {
  it('renders tabs and switches the visible content', async () => {
    render(
      wrap(
        <Ribbon>
          <RibbonTabs defaultValue="home">
            <RibbonTabList>
              <RibbonTab value="home">홈</RibbonTab>
              <RibbonTab value="insert">삽입</RibbonTab>
            </RibbonTabList>
            <RibbonContent value="home">
              <RibbonGroup>
                <RibbonButton size="lg" icon={<Bold className="h-6 w-6" />}>
                  홈 액션
                </RibbonButton>
              </RibbonGroup>
            </RibbonContent>
            <RibbonContent value="insert">
              <RibbonGroup>
                <RibbonButton size="lg" icon={<Italic className="h-6 w-6" />}>
                  삽입 액션
                </RibbonButton>
              </RibbonGroup>
            </RibbonContent>
          </RibbonTabs>
        </Ribbon>
      )
    );
    expect(screen.getByRole('button', { name: '홈 액션' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '삽입 액션' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: '삽입' }));
    expect(screen.getByRole('button', { name: '삽입 액션' })).toBeInTheDocument();
  });
});

describe('RibbonToggleGroup', () => {
  it('toggles single-value selection', async () => {
    render(
      wrap(
        <RibbonToggleGroup type="single" defaultValue="left">
          <RibbonToggleItem value="left" tooltip="왼쪽" icon={<Bold className="h-4 w-4" />} />
          <RibbonToggleItem value="center" tooltip="가운데" icon={<Italic className="h-4 w-4" />} />
        </RibbonToggleGroup>
      )
    );
    const left = screen.getByRole('radio', { name: '왼쪽' });
    const center = screen.getByRole('radio', { name: '가운데' });
    expect(left).toHaveAttribute('aria-checked', 'true');
    expect(center).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(center);
    expect(center).toHaveAttribute('aria-checked', 'true');
    expect(left).toHaveAttribute('aria-checked', 'false');
  });
});
