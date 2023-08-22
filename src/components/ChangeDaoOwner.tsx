import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';

const ChangeDaoOwner = (props: { daoId: string; assetId: number | null }) => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const { makeBatchTransferTxn } = useGenesisDao();
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const handleTransferDao = () => {
    if (!currentWalletAccount) {
      return;
    }
    // todo: invoke makeBatchTransferTxn
  };

  return (
    <div className='flex justify-center'>
      <button
        className={`btn-primary btn w-[180px] ${
          txnProcessing ? 'loading' : ''
        }`}
        disabled={!currentWalletAccount}
        onClick={handleTransferDao}>
        Change Owner
      </button>
    </div>
  );
};

export default ChangeDaoOwner;
