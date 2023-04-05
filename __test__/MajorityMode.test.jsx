import { render, screen } from '@testing-library/react';
import MajorityModel from '../src/components/MajorityModel.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('MajorityModel', () => {
  test('renders MajorityModel', () => {
    render(<MajorityModel daoId={'coolDAO'} />);

    const el = screen.getAllByText(/Majority/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/proposal/);
    expect(ele[0]).toBeInTheDocument();
  });
});
