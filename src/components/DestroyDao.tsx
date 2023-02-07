import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';

const DestroyDao = (props: { daoId: string; assetId: number | null }) => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const { destroyDaoAndAssets } = useGenesisDao();
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);

  const handleDestroy = () => {
    if (!currentWalletAccount) {
      return;
    }
    destroyDaoAndAssets(currentWalletAccount, props.daoId, props.assetId);
  };
  return (
    <div className='mb-2 flex justify-center p-2'>
      <button
        className={`btn-primary btn ${txnProcessing ? 'loading' : ''}`}
        disabled={!currentWalletAccount}
        onClick={handleDestroy}>
        Destroy DAO
      </button>
    </div>
  );
};

export default DestroyDao;
