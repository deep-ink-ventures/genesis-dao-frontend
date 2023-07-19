import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Pagination from '@/components/Pagination';
import type { Asset, AssetHolding } from '@/services/assets';
import { AssetsHoldingsService } from '@/services/assets';
import type { Dao } from '@/services/daos';
import useGenesisStore from '@/stores/genesisStore';

import AssetsHoldingsTable from './AssetsTable';

const Assets = () => {
  const [currentWalletAccount, account] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.pages.account,
  ]);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [assetHoldingsResponse, setAssetHoldingsResponse] = useState<{
    totalCount: number;
    assetHoldings: Array<AssetHolding & { asset?: Asset & { dao?: Dao } }>;
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
      return assetHolding.asset?.dao?.name?.indexOf(searchTerm) !== -1;
    }
  );

  const fetchAssetHoldings = async () => {
    if (account.assets.data) {
      AssetsHoldingsService.listAssetHoldings({
        offset: pagination.offset - 1,
        limit: 5,
      }).then((res) => {
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
              className='input-primary input w-72 text-sm'
              placeholder='Search Assets'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div>
            <div className='relative flex flex-col'>
              <button
                tabIndex={0}
                className={`btn bg-transparent px-6 py-3.5 hover:bg-base-100`}>
                <span className='flex items-center gap-2 text-neutral'>
                  All{' '}
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
        {currentWalletAccount && (
          <AssetsHoldingsTable
            assetHoldings={filteredAssetHoldings}
            currentWallet={currentWalletAccount?.address}
            onTransferClick={(asset) => {
              account.assets.selectAssetHolding(asset);
              account.modals.transferAssets.setVisibility(true);
            }}
            onOpenLinkClick={(assetHolding) => {
              router.push(`/dao/${assetHolding?.asset?.dao_id}`);
            }}
          />
        )}
      </div>
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
    </div>
  );
};

export default Assets;
