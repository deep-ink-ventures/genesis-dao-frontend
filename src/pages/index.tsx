import Image from 'next/image';
import { useEffect } from 'react';

import useGenesisStore from '@/stores/genesisStore';
import circleBG from '@/svg/BG.svg';
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
    console.log('index');
  }, [daos, fetchDaos]);

  useEffect(() => {}, [daosOwnedByWallet, currentWalletAccount]);

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO Description'>
      <div className='flex-col'>
        <div className='mb-8 flex-col items-center justify-center border-b-2 border-dashed border-content-primary/50 pt-2'>
          <div className='my-4 py-5'>
            <h1 className='text-center'>
              Empower The People: Unleash the Potential of Your Organization
              With a DAO
            </h1>
          </div>
          <div className='my-4 flex items-center justify-between px-10 py-4 text-center'>
            <div className='container h-[156px] max-w-[272px] py-2'>
              <h4 className='m-2'>NO-CODE DAO SETUP</h4>
              <h2 className='mb-2'>200</h2>
              <p className='font-medium text-primary'>TOTAL DAO CREATED</p>
            </div>
            <div className='container h-[156px] max-w-[272px] py-2'>
              <h4 className='m-2'>COMMUNITY-LED</h4>
              <h2 className='mb-2'>323K</h2>
              <p className='font-medium text-primary'>TOTAL MEMBERS</p>
            </div>
            <div className='container h-[156px] max-w-[272px] py-2'>
              <h4 className='m-2'>TRANSPARENCY</h4>
              <h2 className='mb-2'>2.7K</h2>
              <p className='font-medium text-primary'>TOTAL PROPOSALS</p>
            </div>
            <div className='container h-[156px] max-w-[272px] py-2'>
              <h4 className='m-2'>DEMOCRATIC</h4>
              <h2 className='mb-2'>2314</h2>
              <p className='font-medium text-primary'>WALLETS VOTED</p>
            </div>
          </div>
        </div>
        <div className='container mb-8 flex min-h-[400px] justify-around'>
          <div className='flex min-w-[50%] flex-auto flex-col items-center text-center'>
            <div className='mx-10 px-28'>
              <h4 className='mt-6'>
                Step into the future of Governance with DAO
              </h4>
            </div>
            <div className='absolute z-[-20] opacity-50 mix-blend-soft-light'>
              <Image src={circleBG} alt='circle bg' height={459} width={598} />
            </div>
          </div>
          <div className='my-10 flex min-w-[50%] flex-auto flex-col justify-between px-24 pb-20 text-center'>
            <div>
              <h3>{`Let's Begin`}</h3>
            </div>
            <div>
              <p>
                Our Platform makes it simple to launch and manage a DAO, with
                customizable governance rules and transparent decision-making
                processes
              </p>
            </div>
            <div>
              <button className='btn-primary btn'>Create a New DAO</button>
            </div>
          </div>
        </div>
        <div className='container mb-6 flex min-h-[600px] justify-center'>
          bottom
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
