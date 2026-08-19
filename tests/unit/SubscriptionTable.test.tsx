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
        currency="USD"
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
        currency="USD"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search services/i);
    fireEvent.change(searchInput, { target: { value: 'Netflix' } });

    expect(screen.getByText('Netflix Premium')).toBeInTheDocument();
    expect(screen.queryByText('AWS Cloud')).not.toBeInTheDocument();
  });

  it('filters subscriptions by category', () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        currencySymbol="$"
        currency="USD"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'Cloud & Hosting' } });

    expect(screen.queryByText('Netflix Premium')).not.toBeInTheDocument();
    expect(screen.getByText('AWS Cloud')).toBeInTheDocument();
  });

  it('filters subscriptions by status', () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        currencySymbol="$"
        currency="USD"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    const statusSelect = screen.getByDisplayValue('All Statuses');
    fireEvent.change(statusSelect, { target: { value: 'trial' } });

    expect(screen.queryByText('Netflix Premium')).not.toBeInTheDocument();
    expect(screen.getByText('AWS Cloud')).toBeInTheDocument();
  });

  it('shows empty state when no subscriptions match filters', () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        currencySymbol="$"
        currency="USD"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search services/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentService' } });

    expect(screen.getByText(/No subscriptions match your filters/i)).toBeInTheDocument();
  });

  it('calls onEdit and onDelete handlers when action buttons are clicked', () => {
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();

    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        currencySymbol="$"
        currency="USD"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={jest.fn()}
      />
    );

    const editButtons = screen.getAllByTitle(/edit subscription/i);
    fireEvent.click(editButtons[0]);
    expect(handleEdit).toHaveBeenCalledWith(mockSubscriptions[0]);

    const deleteButtons = screen.getAllByTitle(/delete subscription/i);
    fireEvent.click(deleteButtons[0]);
    expect(handleDelete).toHaveBeenCalledWith(mockSubscriptions[0]._id);
  });
});
