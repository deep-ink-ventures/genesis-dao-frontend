import { render, screen } from '@testing-library/react';
import GovernanceForm from '../src/components/GovernanceForm.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('GovernanceForm', () => {
  test('renders GovernanceForm', () => {
    render(<GovernanceForm daoId={'coolDAO'} />);

    const el = screen.getAllByText(/Governance/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/Delegated/);
    expect(ele[0]).toBeInTheDocument();
  });
});
