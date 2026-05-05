import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="이름" />);
    expect(screen.getByPlaceholderText('이름')).toBeInTheDocument();
  });

  it('associates label and input via htmlFor/id', () => {
    render(<Input label="이름" />);
    const input = screen.getByLabelText('이름');
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('id')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(<Input label="이름" hint="2~10글자" />);
    expect(screen.getByText('2~10글자')).toBeInTheDocument();
  });

  it('renders error and marks input as invalid', () => {
    render(<Input label="이메일" error="형식이 올바르지 않습니다" />);
    const input = screen.getByLabelText('이메일');
    expect(screen.getByText('형식이 올바르지 않습니다')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('accepts user typing', async () => {
    render(<Input label="이름" />);
    const input = screen.getByLabelText('이름') as HTMLInputElement;
    await userEvent.type(input, 'Miles');
    expect(input.value).toBe('Miles');
  });
});
