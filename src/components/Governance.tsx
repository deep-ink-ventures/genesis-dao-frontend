import useGenesisStore from '@/stores/genesisStore';

import DestroyDao from './DestroyDao';
import ChangeDaoOwner from './ChangeDaoOwner';

const Governance = () => {
  const [currentWalletAccount, currentDao] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.currentDao,
  ]);

  return (
    <div className='container flex w-full flex-col gap-y-4 p-6'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <h1 className='text-2xl'>Governance</h1>
        </div>
      </div>
      <div className='space-y-4 py-4'>
        {!currentWalletAccount && (
          <div className='w-full text-center text-sm text-neutral-focus'>
            Connect to view actions
          </div>
        )}
        {currentWalletAccount &&
          currentWalletAccount?.address === currentDao?.daoOwnerAddress && (
            <>
              <div className='flex items-center rounded-[8px] border-[0.3px] border-neutral-focus p-4 hover:cursor-pointer'>
                <div className='flex grow'>Destroy DAO</div>
                <div className='flex'>
                  <DestroyDao
                    daoId={currentDao.daoId}
                    assetId={currentDao.daoAssetId}
                  />
                </div>
              </div>
              <div className='flex items-center rounded-[8px] border-[0.3px] border-neutral-focus p-4 hover:cursor-pointer'>
                <div className='flex grow'>Change Owner</div>
                <div className='flex'>
                  <ChangeDaoOwner
                    daoId={currentDao.daoId}
                    assetId={currentDao.daoAssetId}
                  />
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default Governance;
