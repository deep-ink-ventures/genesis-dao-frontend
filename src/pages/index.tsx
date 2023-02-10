import Link from 'next/link';
import { useEffect } from 'react';

import DaoCards from '@/components/DaoCards';
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
      <div>
        <div className='hero mt-12 mb-3'>
          <div className='hero-content rounded-xl bg-slate-800 text-center'>
            <div className='max-w-md'>
              <h1 className='mb-2 text-3xl font-bold'>
                Welcome to Genesis DAO
              </h1>
              <p className='py-6'>Here you can create your own DAO</p>
              <Link href='/create' className='border-none hover:text-gray-900'>
                <button className='btn-primary btn'>Create Dao</button>
              </Link>
            </div>
          </div>
        </div>
        <div className='p-2'>
          {daosOwnedByWallet ? (
            <div>
              <h2 className='text-center'>Manage Your Daos:</h2>
              <DaoCards daos={daosOwnedByWallet} />
            </div>
          ) : null}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
