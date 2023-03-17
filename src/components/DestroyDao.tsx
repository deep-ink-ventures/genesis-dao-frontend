import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';

const DestroyDao = (props: { daoId: string; assetId: number | null }) => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const { destroyDaoAndAssets } = useGenesisDao();
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  // fixme need to fix button loading
  const handleDestroy = () => {
    if (!currentWalletAccount) {
      return;
    }
    updateTxnProcessing(true);
    destroyDaoAndAssets(props.daoId, props.assetId);
  };
  return (
    <div className='flex justify-center'>
      <button
        className={`btn-primary btn w-[180px] ${
          txnProcessing ? 'loading' : ''
        }`}
        disabled={!currentWalletAccount}
        onClick={handleDestroy}>
        Destroy DAO
      </button>
    </div>
  );
};

export default DestroyDao;
