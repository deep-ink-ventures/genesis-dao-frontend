// import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';
// import TransferAssetModal from './TransferAssetModal';

const TransferAsset = (props: { daoId: string; assetId: number | null }) => {
  // todo: fetch asset. dao, and assetholding details
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  // const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const handleTransferAsset = () => {
    // todo: open TransferAssetModal
  };

  return (
    <>
      <div className='flex justify-center'>
        <button
          className={`btn-primary btn w-[180px] ${
            txnProcessing ? 'loading' : ''
          }`}
          disabled={!currentWalletAccount || true}
          onClick={handleTransferAsset}>
          Transfer Asset
        </button>
      </div>
      {/* <TransferAssetModal
                assetHolding={assetHolding}
                open={open}
                onClose={onClose}
                onSuccess={onSuccess}
            /> */}
    </>
  );
};

export default TransferAsset;
