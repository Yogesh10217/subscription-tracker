import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SubscriptionTable, SubscriptionItem } from '../../src/components/SubscriptionTable';

const mockSubscriptions: SubscriptionItem[] = [
  {
    _id: '1',
    name: 'Netflix Premium',
    price: 19.99,
    currency: 'USD',
    frequency: 'monthly',
    category: 'Entertainment',
    paymentMethod: 'Visa',
    status: 'active',
    startDate: '2024-01-01',
    renewalDate: '2024-02-01',
  },
  {
    _id: '2',
    name: 'AWS Cloud',
    price: 150.0,
    currency: 'USD',
    frequency: 'monthly',
    category: 'Cloud & Hosting',
    paymentMethod: 'Mastercard',
    status: 'trial',
    startDate: '2024-01-10',
    renewalDate: '2024-02-10',
  },
];

describe('SubscriptionTable Component', () => {
  it('renders all subscriptions by default', () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        currencySymbol="$"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    expect(screen.getByText('Netflix Premium')).toBeInTheDocument();
    expect(screen.getByText('AWS Cloud')).toBeInTheDocument();
  });

  it('filters subscriptions by search input term', () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        currencySymbol="$"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search services...');
    fireEvent.change(searchInput, { target: { value: 'Netflix' } });

    expect(screen.getByText('Netflix Premium')).toBeInTheDocument();
    expect(screen.queryByText('AWS Cloud')).not.toBeInTheDocument();
  });
});
