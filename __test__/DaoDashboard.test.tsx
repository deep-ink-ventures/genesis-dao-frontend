import { act, render, screen } from '@testing-library/react';

import DaoDashboard from '../src/components/DaoDashboard';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

describe('DaoDashboard', () => {
  test('renders DaoDashboard', async () => {
    // eslint-disable-next-line
    await act(async () => render(<DaoDashboard />));

    const el = screen.getAllByRole('button');
    expect(el[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
