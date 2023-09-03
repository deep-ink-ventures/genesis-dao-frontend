import useGenesisStore from '@/stores/genesisStore';

import ChangeDaoOwner from './ChangeDaoOwner';
import DestroyMultiSigDao from './DestroyMultiSigDao';
import TransferTreasuryAsset from './TransferTreasuryAsset';

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
            <div className='flex items-center gap-2 rounded-[8px] border-[0.3px] border-neutral-focus p-4'>
              <div className='flex w-1/6 shrink-0'>Change Owner</div>
              <div className='flex grow'>
                Transfer DAO ownership to another account
              </div>
              <div className='flex'>
                <ChangeDaoOwner />
              </div>
            </div>
            <div className='flex items-center gap-2 rounded-[8px] border-[0.3px] border-neutral-focus p-4'>
              <div className='flex w-1/6 shrink-0'>Transfer Tokens</div>
              <div className='flex grow'>
                Transfer tokens from your treasury to other accounts
              </div>
              <div className='flex'>
                <TransferTreasuryAsset />
              </div>
            </div>
            <div className='flex items-center gap-2 rounded-[8px] border-[0.3px] border-neutral-focus p-4'>
              <div className='flex w-1/6 shrink-0'>Destroy DAO</div>
              <div className='flex grow'>
                Say goodbye to your organization. Your deposit will be returned
                to the DAO creator
              </div>
              <div className='relative flex'>
                <div className='absolute left-[80px] top-[-8px] z-10 flex h-[25px] w-[100px] items-center justify-center rounded-[15px] bg-primary text-center text-xs font-medium text-black'>
                  Coming Soon!
                </div>
                <DestroyMultiSigDao />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Governance;
