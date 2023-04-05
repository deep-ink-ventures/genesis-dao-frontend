import { render, screen } from '@testing-library/react';
import CouncilTokens from '../src/components/CouncilTokens.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('CouncilTokens', () => {
  test('renders CouncilTokens', () => {
    render(<CouncilTokens daoId={'coolDAO'} />);

    const el = screen.getAllByText(/Council/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/Approval/);
    expect(ele[0]).toBeInTheDocument();
  });
});
