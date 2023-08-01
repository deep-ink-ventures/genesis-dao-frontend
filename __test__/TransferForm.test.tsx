/* eslint-disable testing-library/prefer-screen-queries */
import { render } from '@testing-library/react';

import TransferForm from '@/components/TransferForm';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('TransferAssetModal', () => {
  test('renders TransferAssetModal', () => {
    const { getByText } = render(<TransferForm assetId={1} daoId='DAOID' />);
    expect(
      getByText(/Your current DAOID token balance is 0/)
    ).toBeInTheDocument();
  });
});
