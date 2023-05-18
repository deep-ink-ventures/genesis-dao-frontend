import { act, render, screen } from '@testing-library/react';

import ReviewProposal from '../src/components/ReviewProposal';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

describe('ReviewProposal', () => {
  test('renders ReviewProposal', async () => {
    // eslint-disable-next-line
    await act(async () => render(<ReviewProposal daoId={'MANGO'} handleChangePage={() => {}}/>));

    const el = screen.getAllByText(/Review Proposal/);
    expect(el[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
