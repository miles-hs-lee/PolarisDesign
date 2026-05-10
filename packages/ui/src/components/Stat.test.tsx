import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stat } from './Stat';

describe('Stat', () => {
  it('renders label + value', () => {
    render(<Stat label="조회수" value="1,234" />);
    expect(screen.getByText('조회수')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders delta when provided', () => {
    render(<Stat label="조회수" value="1,234" delta="+12%" />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('omits delta region when delta not provided', () => {
    render(<Stat label="조회수" value="1,234" />);
    expect(screen.queryByText('+12%')).not.toBeInTheDocument();
  });

  it('applies positive tone color to delta', () => {
    render(<Stat label="x" value="1" delta="+5%" deltaTone="positive" />);
    expect(screen.getByText('+5%')).toHaveClass('text-state-success');
  });

  it('applies negative tone color to delta', () => {
    render(<Stat label="x" value="1" delta="-3%" deltaTone="negative" />);
    expect(screen.getByText('-3%')).toHaveClass('text-state-error');
  });

  it('renders helper text when provided', () => {
    render(<Stat label="x" value="1" helper="지난 7일 기준" />);
    expect(screen.getByText('지난 7일 기준')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(
      <Stat label="x" value="1" icon={<svg data-testid="ic" />} />
    );
    expect(container.querySelector('[data-testid="ic"]')).toBeInTheDocument();
  });
});
