import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from './Alert';

describe('Alert', () => {
  it('renders title and description', () => {
    render(
      <Alert variant="info">
        <AlertTitle>안내</AlertTitle>
        <AlertDescription>설명입니다.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('안내')).toBeInTheDocument();
    expect(screen.getByText('설명입니다.')).toBeInTheDocument();
  });

  it('renders default leading icon for info variant', () => {
    const { container } = render(
      <Alert variant="info">
        <AlertTitle>안내</AlertTitle>
      </Alert>
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('hides icon when hideIcon=true', () => {
    const { container } = render(
      <Alert variant="info" hideIcon>
        <AlertTitle>안내</AlertTitle>
      </Alert>
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('applies danger variant border', () => {
    const { container } = render(
      <Alert variant="danger">
        <AlertTitle>오류</AlertTitle>
      </Alert>
    );
    expect(container.firstChild).toHaveClass('border-status-danger');
  });
});
