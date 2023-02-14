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
  }, []);

  useEffect(() => {}, [daosOwnedByWallet, currentWalletAccount]);

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO Description'>
      <div className='z-1 flex-col'>
        <div className='align-center flex-col justify-center'>
          <div className='py-  my-4'>
            <h1 className='text-center'>
              Empower The People: Unleash the Potential of Your Organization
              With a DAO
            </h1>
          </div>
          <div className='my-4 flex justify-between px-10 py-4 text-center align-middle'>
            <div className='shadow-[0_2px_2px_rgb(0,0,0,0.2) h-[156px] w-[300px] rounded-[10px] border-[0.5px] bg-card-primary py-2 opacity-80'>
              <h4 className='m-2'>NO-CODE DAO SETUP</h4>
              <h3 className='mb-2'>200</h3>
              <p className='text-primary'>TOTAL DAO CREATED</p>
            </div>
            <div className='shadow-[0_2px_2px_rgb(0,0,0,0.2) h-[156px] w-[300px] rounded-[10px] border-[0.5px] bg-card-primary py-2 opacity-80'>
              <h4 className='m-2'>COMMUNITY-LED</h4>
              <h3 className='mb-2'>323K</h3>
              <p className='text-primary'>TOTAL MEMBERS</p>
            </div>
            <div className='shadow-[0_2px_2px_rgb(0,0,0,0.2) h-[156px] w-[300px] rounded-[10px] border-[0.5px] bg-card-primary py-2 opacity-80'>
              <h4 className='m-2'>TRANSPARENCY</h4>
              <h3 className='mb-2'>2.7K</h3>
              <p className='text-primary'>TOTAL PROPOSALS</p>
            </div>
            <div className='shadow-[0_2px_2px_rgb(0,0,0,0.2) h-[156px] w-[300px] rounded-[10px] border-[0.5px] bg-card-primary py-2 opacity-80'>
              <h4 className='m-2'>DEMOCRATIC</h4>
              <h3 className='mb-2'>2314</h3>
              <p className='text-primary'>WALLETS VOTED</p>
            </div>
          </div>
        </div>
        <div>mid</div>
        <div>botom</div>
      </div>
      <div
        className={`absolute top-[-40px] left-[15%] z-[-100] h-[60%] w-[80%] bg-[url('../../public/images/background-texture.png')] mix-blend-screen`}></div>
    </MainLayout>
  );
};

export default Index;
