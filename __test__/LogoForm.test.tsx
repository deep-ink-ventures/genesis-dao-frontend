import { act, render, screen } from '@testing-library/react';

import LogoForm from '../src/components/LogoForm';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

describe('LogoForm', () => {
  test('renders Logo Form', async () => {
    // eslint-disable-next-line
    await act(async () => render(<LogoForm daoId='MANGO' />));

    const el = screen.getAllByText(/Logo/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/Description/);
    expect(ele[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
