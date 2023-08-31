import cn from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import type { Asset, AssetHolding } from '@/services/assets';
import { AssetsHoldingsService } from '@/services/assets';
import type { RawDao } from '@/services/daos';
import useGenesisStore from '@/stores/genesisStore';

import type { AssetHoldingsTableItem } from './AssetsTable';
import AssetsHoldingsTable from './AssetsTable';

enum AssetTableFilter {
  All = 'All',
  Admin = 'Admin',
  TokenHolder = 'TokenHolder',
}

const AssetFilterList = [
  {
    value: AssetTableFilter.All,
    label: 'All',
  },
  {
    value: AssetTableFilter.Admin,
    label: 'Admin',
  },
  {
    value: AssetTableFilter.TokenHolder,
    label: 'Token Holder',
  },
];

const Assets = () => {
  const [currentWalletAccount, account] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.account,
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filter, setFilter] = useState(AssetTableFilter.All);

  const [searchTerm, setSearchTerm] = useState('');
  const [assetHoldingsResponse, setAssetHoldingsResponse] = useState<{
    totalCount: number;
    assetHoldings: Array<AssetHolding & { asset?: Asset & { dao?: RawDao } }>;
  }>();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    offset: 0,
  });

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filteredAssetHoldings = assetHoldingsResponse?.assetHoldings.filter(
    (assetHolding) => {
      const isOwner =
        assetHolding.asset?.dao?.creator_id?.toLowerCase().trim() ===
        currentWalletAccount?.address?.toLowerCase().trim();

      return (
        assetHolding.asset?.dao?.name?.indexOf(searchTerm) !== -1 &&
        (filter === AssetTableFilter.All ||
          (filter === AssetTableFilter.Admin ? isOwner : !isOwner))
      );
    }
  );

  const handleTransferClick = (asset?: AssetHoldingsTableItem) => {
    account.assets.selectAssetHolding(asset);
    account.modals.transferAssets.setVisibility(true);
  };

  // const handleLinkClick = (assetHolding?: AssetHoldingsTableItem) => {
  //   router.push(`/dao/${assetHolding?.asset?.dao_id}`);
  // };
  // fixme this is temporary. Will link to https://www.subscan.io/ later
  const handleLinkClick = () => {
    window.open(
      `https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fnode.genesis-dao.org#/accounts`,
      '_blank'
    );
  };

  const fetchAssetHoldings = async () => {
    if (account.assets.data) {
      AssetsHoldingsService.listAssetHoldings({
        offset: pagination.offset - 1,
        limit: 5,
        owner_id: currentWalletAccount?.address,
      }).then((res) => {
        if (!res) {
          return;
        }
        setAssetHoldingsResponse({
          totalCount: res.count,
          assetHoldings: res.results?.map((assetHolding) => ({
            ...assetHolding,
            asset: account.assets.data.find(
              (asset) => asset.id === assetHolding.asset_id
            ),
          })),
        });
      });
    }
  };

  useEffect(() => {
    fetchAssetHoldings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.assets.data, pagination.currentPage]);

  const handleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSetFilter = (newFilter: AssetTableFilter) => {
    setFilter(newFilter);
    setDropdownOpen(false);
  };

  return (
    <div className='container flex w-full flex-col gap-y-4 p-6'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <h1 className='text-2xl'>My Assets</h1>
        </div>
        <div className='flex gap-x-4'>
          <div>
            <input
              id='search-input'
              className='input input-primary w-72 text-sm'
              placeholder='Search Assets'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div>
            <div className='flex flex-col'>
              <button
                tabIndex={0}
                className={`btn bg-transparent px-6 py-3.5 hover:bg-base-100`}
                onClick={handleDropdownOpen}>
                <span className='flex items-center gap-2 text-neutral'>
                  {AssetFilterList.find(
                    (assetFilter) => assetFilter.value === filter
                  )?.label || AssetTableFilter.All}{' '}
                  <span>
                    <svg
                      width='20'
                      height='16'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M11.9802 16.9929C11.8484 16.9929 11.7099 16.9671 11.5648 16.9156C11.4198 16.864 11.2813 16.7739 11.1495 16.645L3.35604 9.03111C3.11868 8.79921 3 8.51579 3 8.18082C3 7.84586 3.11868 7.56244 3.35604 7.33054C3.59341 7.09865 3.87033 6.9827 4.18681 6.9827C4.5033 6.9827 4.78022 7.09865 5.01758 7.33054L11.9802 14.1328L18.9429 7.33054C19.1802 7.09865 19.4637 6.9827 19.7934 6.9827C20.1231 6.9827 20.4066 7.09865 20.644 7.33054C20.8813 7.56244 21 7.83942 21 8.1615C21 8.48358 20.8813 8.76057 20.644 8.99246L12.811 16.645C12.6791 16.7739 12.5473 16.864 12.4154 16.9156C12.2835 16.9671 12.1385 16.9929 11.9802 16.9929Z'
                        fill='#FAFAFA'
                      />
                    </svg>
                  </span>
                </span>
              </button>
              <div className='relative'>
                <div
                  className={cn(
                    'shadow-[0_0_4px_0_rgba(255, 255, 255, 0.20)] absolute right-0 top-[5px] w-fit space-y-2 rounded-2xl bg-primary-content py-1 shadow-sm',
                    {
                      hidden: !dropdownOpen,
                    }
                  )}>
                  {AssetFilterList.map((assetFilter) => (
                    <div
                      key={assetFilter.value}
                      onClick={() => handleSetFilter(assetFilter.value)}
                      className={cn(
                        `group flex cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-2 hover:text-primary`,
                        {
                          'text-primary': assetFilter.value === filter,
                        }
                      )}>
                      {assetFilter.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='py-4'>
        {!currentWalletAccount && (
          <div className='w-full text-center text-sm text-neutral-focus'>
            Connect to view Assets
          </div>
        )}
        {currentWalletAccount && account.assets.loading && (
          <Loading spinnerSize='32' />
        )}
        {currentWalletAccount && !account.assets.loading && (
          <>
            {filteredAssetHoldings?.length ? (
              <AssetsHoldingsTable
                assetHoldings={filteredAssetHoldings}
                currentWallet={currentWalletAccount?.address}
                onTransferClick={handleTransferClick}
                onOpenLinkClick={handleLinkClick}
              />
            ) : (
              <div>Sorry, no assets found</div>
            )}
          </>
        )}
      </div>
      {currentWalletAccount &&
        !account.assets.loading &&
        Boolean(filteredAssetHoldings?.length) && (
          <div>
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={5}
              totalCount={assetHoldingsResponse?.totalCount}
              onPageChange={(newPage, newOffset) =>
                setPagination({ currentPage: newPage, offset: newOffset })
              }
            />
          </div>
        )}
    </div>
  );
};

export default Assets;
