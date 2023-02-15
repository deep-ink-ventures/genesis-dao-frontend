import { useEffect } from 'react';

import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const Index = () => {
  const fetchDaos = useGenesisStore((s) => s.fetchDaos);
  const daos = useGenesisStore((s) => s.daos);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const daosOwnedByWallet = useGenesisStore((s) => s.daosOwnedByWallet);
  useEffect(() => {
    if (!daos) {
      fetchDaos();
    }
  }, [fetchDaos, daos]);

  useEffect(() => {}, [daosOwnedByWallet, currentWalletAccount]);

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO Description'>
      <div className='flex-col'>
        <div className='flex-col items-center justify-center pt-2'>
          <div className='my-4 py-5'>
            <h1 className='text-center'>
              Empower The People: Unleash the Potential of Your Organization
              With a DAO
            </h1>
          </div>
          <div className='my-4 flex items-center justify-between px-10 py-4 text-center'>
            <div className='h-[156px] w-[300px] rounded-[10px] border-[0.5px] border-primary/10 bg-card-primary/60 py-2 shadow-[0_2px_2px_rgb(0,0,0,0.2)]'>
              <h4 className='m-2'>NO-CODE DAO SETUP</h4>
              <h2 className='mb-2'>200</h2>
              <p className='text-primary'>TOTAL DAO CREATED</p>
            </div>
            <div className='h-[156px] w-[300px] rounded-[10px] border-[0.5px] border-primary/10 bg-card-primary/60 py-2 shadow-[0_2px_2px_rgb(0,0,0,0.2)]'>
              <h4 className='m-2'>COMMUNITY-LED</h4>
              <h2 className='mb-2'>323K</h2>
              <p className='text-primary'>TOTAL MEMBERS</p>
            </div>
            <div className='h-[156px] w-[300px] rounded-[10px] border-[0.5px] border-primary/10 bg-card-primary/60 py-2 shadow-[0_2px_2px_rgb(0,0,0,0.2)]'>
              <h4 className='m-2'>TRANSPARENCY</h4>
              <h2 className='mb-2'>2.7K</h2>
              <p className='text-primary'>TOTAL PROPOSALS</p>
            </div>
            <div className='h-[156px] w-[300px] rounded-[10px] border-[0.5px] border-primary/10 bg-card-primary/60 py-2 shadow-[0_2px_2px_rgb(0,0,0,0.2)]'>
              <h4 className='m-2'>DEMOCRATIC</h4>
              <h2 className='mb-2'>2314</h2>
              <p className='text-primary'>WALLETS VOTED</p>
            </div>
          </div>
        </div>
        <div>mid</div>
        <div>botom</div>
      </div>
    </MainLayout>
  );
};

export default Index;
