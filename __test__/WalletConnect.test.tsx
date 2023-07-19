import { render, screen } from '@testing-library/react';

import WalletConnect from '@/components/WalletConnect';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Wallet Connect', () => {
  it('should render the button', async () => {
    render(<WalletConnect text='Connect' />);
    await screen.findAllByRole('button').then((button) => {
      expect(button[0]).toBeInTheDocument();
    });
  });
});
