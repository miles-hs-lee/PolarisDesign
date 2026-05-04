import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileIcon } from './FileIcon';

describe('FileIcon', () => {
  it('uses the correct file color class per type', () => {
    const { rerender } = render(<FileIcon type="docx" />);
    expect(screen.getByLabelText('DOCX file')).toHaveClass('bg-file-docx');

    rerender(<FileIcon type="xlsx" />);
    expect(screen.getByLabelText('XLSX file')).toHaveClass('bg-file-xlsx');

    rerender(<FileIcon type="pptx" />);
    expect(screen.getByLabelText('PPTX file')).toHaveClass('bg-file-pptx');

    rerender(<FileIcon type="pdf" />);
    expect(screen.getByLabelText('PDF file')).toHaveClass('bg-file-pdf');
  });

  it('treats hwp identically to docx (both blue)', () => {
    render(<FileIcon type="hwp" />);
    expect(screen.getByLabelText('HWP file')).toHaveClass('bg-file-hwp');
  });

  it('renders the file extension label', () => {
    render(<FileIcon type="docx" />);
    expect(screen.getByText('DOCX')).toBeInTheDocument();
  });
});
