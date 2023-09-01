import useGenesisStore from '@/stores/genesisStore';

const DestroyMultiSigDao = () => {
  // const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  // const { destroyDaoAndAssets } = useGenesisDao();
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  // const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  // fixme need to fix button loading
  const handleDestroy = () => {};

  return (
    <div className='flex justify-center'>
      <button
        className={`btn btn-primary w-[180px] ${
          txnProcessing ? 'loading' : ''
        }`}
        disabled={true}
        onClick={handleDestroy}>
        Destroy DAO
      </button>
    </div>
  );
};

export default DestroyMultiSigDao;
