import { render, screen } from '@testing-library/react';

import WalletConnect from '@/components/WalletConnect';

describe('Wallet Connect', () => {
  it('should render the button', async () => {
    render(<WalletConnect />);
    await screen.findAllByRole('button').then((button) => {
      expect(button[0]).toBeInTheDocument();
    });
  });
});
