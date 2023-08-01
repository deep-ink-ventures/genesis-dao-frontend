/* eslint-disable testing-library/prefer-screen-queries */
import { fireEvent, render, screen } from '@testing-library/react';

import Transactions from '@/components/Transactions';

jest.mock('@/components/TransactionAccordion');

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

describe('Transactions', () => {
  test('renders Transactions', () => {
    render(<Transactions daoId='1' />);

    const title = screen.getAllByText(/Transactions/);
    expect(title[0]).toBeInTheDocument();
  });

  test('updates the searchTerm when the input value changes', () => {
    const { getByPlaceholderText } = render(<Transactions daoId='1' />);
    const inputElement = getByPlaceholderText('Search') as HTMLInputElement;

    expect(inputElement).toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value: 'Test' } });

    expect(inputElement.value).toBe('Test');
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
