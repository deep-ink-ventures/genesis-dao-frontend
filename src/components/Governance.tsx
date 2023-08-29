import useGenesisStore from '@/stores/genesisStore';

import ChangeDaoOwner from './ChangeDaoOwner';
import DestroyDao from './DestroyDao';
import TransferAsset from './TransferAsset';

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
        {currentWalletAccount && currentDao && (
          <>
            <div className='flex items-center gap-2 rounded-[8px] border-[0.3px] border-neutral-focus p-4 hover:cursor-pointer'>
              <div className='flex w-1/6 shrink-0'>Change Owner</div>
              <div className='flex grow'>
                Transfer Ownership of the DAO to another account
              </div>
              <div className='flex'>
                <ChangeDaoOwner />
              </div>
            </div>
            <div className='flex items-center gap-2 rounded-[8px] border-[0.3px] border-neutral-focus p-4 hover:cursor-pointer'>
              <div className='flex w-1/6 shrink-0'>Transfer Asset</div>
              <div className='flex grow'>
                Transfer tokens from your treasury to other accounts
              </div>
              <div className='flex'>
                <TransferAsset />
              </div>
            </div>
            <div className='flex items-center gap-2 rounded-[8px] border-[0.3px] border-neutral-focus p-4 hover:cursor-pointer'>
              <div className='flex w-1/6 shrink-0'>Destroy DAO</div>
              <div className='flex grow'>
                Say goodbye and wrap up. Your stake will be repaid to the
                current DAO Owner
              </div>
              <div className='flex'>
                <DestroyDao
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
