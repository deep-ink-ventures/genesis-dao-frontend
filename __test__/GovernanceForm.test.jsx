import { render, screen, act } from '@testing-library/react';
import GovernanceForm from '../src/components/GovernanceForm.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  });
});

describe('GovernanceForm', () => {
  test('renders GovernanceForm', async () => {
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
