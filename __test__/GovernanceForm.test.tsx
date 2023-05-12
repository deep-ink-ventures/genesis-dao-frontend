import { act, render, screen } from '@testing-library/react';

import GovernanceForm from '../src/components/GovernanceForm';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

describe('GovernanceForm', () => {
  test('renders GovernanceForm', async () => {
    // eslint-disable-next-line
    await act(async () => render(<GovernanceForm daoId={'coolDAO'} />));

    const el = screen.getAllByText(/Governance/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/Delegated/);
    expect(ele[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
