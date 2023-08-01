/* eslint-disable testing-library/prefer-screen-queries */
import { render } from '@testing-library/react';

import TransferAssetModal from '@/components/TransferAssetModal';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const assetHolding = {
  asset: {
    id: 1,
    name: 'Asset 1',
    dao: {
      id: 101,
      name: 'DAO 1',
    },
  },
  balance: 10,
} as any;

describe('TransferAssetModal', () => {
  test('renders TransferAssetModal', () => {
    const { getByText } = render(
      <TransferAssetModal assetHolding={assetHolding} open onClose={() => {}} />
    );
    expect(getByText(/Transfer Asset/)).toBeInTheDocument();
  });
});
