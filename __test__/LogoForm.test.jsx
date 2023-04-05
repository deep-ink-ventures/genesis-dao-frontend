import { render, screen } from '@testing-library/react';
import LogoForm from '../src/components/LogoForm.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LogoForm', () => {
  test('renders Logo Form', () => {
    render(<LogoForm daoId={'coolDAO'} />);

    const el = screen.getAllByText(/Logo/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/Description/);
    expect(ele[0]).toBeInTheDocument();
  });
});
