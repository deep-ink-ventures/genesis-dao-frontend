// import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';

const ChangeDaoOwner = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  // const { makeBatchTransferTxn } = useGenesisDao();
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  // const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const handleTransferDao = () => {
    // todo: invoke makeBatchTransferTxn
  };

  return (
    <div className='flex justify-center'>
      <button
        className={`btn-primary btn w-[180px] ${
          txnProcessing ? 'loading' : ''
        }`}
        disabled={!currentWalletAccount || true}
        onClick={handleTransferDao}>
        Change Owner
      </button>
    </div>
  );
};

export default ChangeDaoOwner;
