import { render, screen } from '@testing-library/react';
import CustomizedModel from '../src/components/CustomizedModel.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('CustomizedModel', () => {
  test('renders CustomizedModel', () => {
    render(<CustomizedModel />);

    const el = screen.getAllByText(/Contact/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/Email/);
    expect(ele[0]).toBeInTheDocument();
  });
});
