// import useGenesisDao from '@/hooks/useGenesisDao';
import { useCallback, useEffect, useState } from 'react';

import type { Asset, AssetHolding } from '@/services/assets';
import { AssetsHoldingsService } from '@/services/assets';
import type { Dao } from '@/services/daos';
import useGenesisStore from '@/stores/genesisStore';

import TransferAssetModal from './TransferAssetModal';

const TransferAsset = () => {
  const [currentDao, fetchDaoTokenBalanceFromDB, currentWalletAccount] =
    useGenesisStore((s) => [
      s.currentDao,
      s.fetchDaoTokenBalanceFromDB,
      s.currentWalletAccount,
    ]);
  const [open, setOpen] = useState(false);

  const [assetHolding, setAssetHolding] = useState<
    AssetHolding & { asset?: Asset & { dao?: Dao } }
  >();

  const fetchData = useCallback(async () => {
    if (currentDao?.daoAssetId) {
      const newAssetHolding = await AssetsHoldingsService.listAssetHoldings({
        asset_id: currentDao.daoAssetId.toString(),
      }).then((result) => result?.results?.[0]);

      if (newAssetHolding) {
        setAssetHolding(newAssetHolding);
      }
    }
  }, [currentDao]);

  useEffect(() => {
    if (currentDao?.daoAssetId) {
      fetchData();
    }
  }, [currentDao, fetchData]);
  // todo: fetch asset. dao, and assetholding details
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  // const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const handleTransferAsset = () => {
    if (assetHolding) {
      setOpen(true);
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const onSuccess = () => {
    onClose();
    if (currentDao?.daoAssetId && currentWalletAccount) {
      fetchDaoTokenBalanceFromDB(
        currentDao?.daoAssetId,
        currentWalletAccount.address
      );
    }
  };

  return (
    <>
      <div className='flex justify-center'>
        <button
          className={`btn-primary btn w-[180px] ${
            txnProcessing ? 'loading' : ''
          }`}
          disabled={!currentWalletAccount || !assetHolding}
          onClick={handleTransferAsset}>
          Transfer Asset
        </button>
      </div>
      {assetHolding && (
        <TransferAssetModal
          assetHolding={assetHolding}
          daoId={currentDao?.daoId}
          daoImage={currentDao?.images?.small}
          open={open}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};

export default TransferAsset;
