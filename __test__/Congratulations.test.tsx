import { render, screen } from '@testing-library/react';

import Congratulations from '../src/components/Congratulations';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Congratulations', () => {
  test('renders congratulations', () => {
    render(<Congratulations daoId='MANGO' />);

    const el = screen.getAllByText(/Congratulations/);
    expect(el[0]).toBeInTheDocument();
  });
});
