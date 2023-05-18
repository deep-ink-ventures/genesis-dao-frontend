import { act, render, screen } from '@testing-library/react';

import Proposals from '../src/components/Proposals';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Proposals', () => {
  test('renders Proposals', async () => {
    // eslint-disable-next-line
    await act(async () => render(<Proposals daoId={'MANGO'} />));

    const el = screen.getAllByText(/Proposals/);
    expect(el[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
