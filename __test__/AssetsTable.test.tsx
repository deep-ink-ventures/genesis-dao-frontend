/* eslint-disable testing-library/prefer-screen-queries */
import { render, screen } from '@testing-library/react';

import AssetsTable from '@/components/AssetsTable';

describe('AssetsTable', () => {
  test('renders the table header correctly', () => {
    const { getByText } = render(<AssetsTable />);
    expect(getByText('DAO NAME')).toBeInTheDocument();
    expect(getByText('DAO ID')).toBeInTheDocument();
    expect(getByText('Role')).toBeInTheDocument();
    expect(getByText('Owned Tokens')).toBeInTheDocument();
    expect(getByText('Actions')).toBeInTheDocument();
  });

  test('renders the table rows with correct data', () => {
    const items = [
      {
        dao_id: 'DAOID',
        owner_id: 'Owner 1',
        balance: 100000000000000,
        image: 'image1.jpg',
        asset: {
          dao: {
            id: 'DAOID',
            name: 'Item 1',
            creator_id: 'Owner 1',
          },
        },
        asset_id: 1,
        id: 1,
      },
      {
        dao_id: 'DAOID',
        name: 'Item 2',
        owner_id: 'Owner 2',
        balance: 100000000000000,
        image: 'image1.jpg',
        asset: {
          dao: {
            id: 'DAOID',
            name: 'Item 2',
            creator_id: 'Owner 2',
          },
        },
        asset_id: 2,
        id: 2,
      },
    ];

    const { getByText } = render(
      <AssetsTable assetHoldings={items as any} currentWallet='Owner 1' />
    );

    expect(getByText('Item 1')).toBeInTheDocument();
    expect(screen.getAllByText('DAOID').length).toBe(2);
    expect(getByText('Admin')).toBeInTheDocument();
    expect(getByText('Token Holder')).toBeInTheDocument();
    expect(screen.getAllByText('10,000 DAOID')[0]).toBeInTheDocument();
  });
});
