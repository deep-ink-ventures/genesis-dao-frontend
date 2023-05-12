import { act, render, screen } from '@testing-library/react';

import CouncilTokens from '../src/components/CouncilTokens';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

describe('CouncilTokens', () => {
  test('renders CouncilTokens', async () => {
    // eslint-disable-next-line
    await act(async () => render(<CouncilTokens daoId={'coolDAO'} />));

    const el = screen.getAllByText(/Council/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/Approval/);
    expect(ele[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
