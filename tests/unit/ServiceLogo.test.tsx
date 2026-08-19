import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ServiceLogo } from '../../src/components/ServiceLogo';

describe('ServiceLogo Component', () => {
  it('renders brand SVG when service matches a known brand', () => {
    const { container } = render(<ServiceLogo name="Netflix" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders monogram fallback with first letter when service is unknown', () => {
    render(<ServiceLogo name="Custom Tool" />);
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('renders default fallback letter S when name is empty', () => {
    render(<ServiceLogo name="" />);
    expect(screen.getByText('S')).toBeInTheDocument();
  });
});
