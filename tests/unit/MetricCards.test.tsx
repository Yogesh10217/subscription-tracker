import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricCards } from '../../src/components/MetricCards';

describe('MetricCards Component', () => {
  it('renders monthly spend and yearly estimate correctly', () => {
    render(
      <MetricCards
        totalMonthlySpend={428.5}
        yearlyEstimate={5142.0}
        activeCount={14}
        trialCount={2}
        upcomingRenewalsCount={3}
        currencySymbol="$"
      />
    );

    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('$428.50')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays the currency symbol passed in props', () => {
    render(
      <MetricCards
        totalMonthlySpend={100}
        yearlyEstimate={1200}
        activeCount={5}
        trialCount={0}
        upcomingRenewalsCount={1}
        currencySymbol="₹"
      />
    );

    expect(screen.getByText('₹100.00')).toBeInTheDocument();
  });
});
