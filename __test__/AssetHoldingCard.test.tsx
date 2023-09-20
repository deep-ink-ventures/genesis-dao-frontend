import { BN } from '@polkadot/util';
import { render, screen } from '@testing-library/react';

import AssetHoldingCard from '../src/components/AssetHoldingCard';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockDao = {
  id: 1,
  name: 'DAO',
  creator_id: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
  owner_id: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
  asset_id: 1,
  proposal_duration: 5,
};

const mockAsset = {
  dao_id: '1',
  id: 1,
  owner_id: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
  total_supply: 1000,
  dao: mockDao,
};

const mockAssetHolding = {
  assetId: 1,
  balance: new BN('10000000000000000000000000'),
  id: 1,
  ownerId: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
  asset: mockAsset,
};

describe('AssetHoldingCard', () => {
  test('renders the owned balance', () => {
    render(<AssetHoldingCard assetHolding={mockAssetHolding as any} />);

    const el = screen.getAllByText(/Owned Tokens: 1,000,000,000,000,000/);
    expect(el[0]).toBeInTheDocument();
  });
});
