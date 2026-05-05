import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea placeholder="내용" />);
    expect(screen.getByPlaceholderText('내용')).toBeInTheDocument();
  });

  it('uses default rows=4', () => {
    render(<Textarea label="설명" />);
    expect(screen.getByLabelText('설명')).toHaveAttribute('rows', '4');
  });

  it('error sets aria-invalid', () => {
    render(<Textarea label="설명" error="필수 항목입니다" />);
    expect(screen.getByLabelText('설명')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('필수 항목입니다')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
