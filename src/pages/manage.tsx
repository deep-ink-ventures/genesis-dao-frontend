import { useEffect } from 'react';

import Spinner from '@/components/Spinner';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

// fixme something this page fires connection so many times it gets disconnected
const ManageDao = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const daos = useGenesisStore((s) => s.daos);
  const fetchDaos = useGenesisStore((s) => s.fetchDaos);
  const daosOwnedByWallet = useGenesisStore((s) => s.daosOwnedByWallet);

  useEffect(() => {
    if (!daosOwnedByWallet && currentWalletAccount?.address) {
      fetchDaos();
    }
  }, [daos, daosOwnedByWallet, currentWalletAccount, fetchDaos]);

  const noWallet = () => {
    return (
      <MainLayout
        title='Manage Your DAO - GenesisDAO'
        description='Manage Your DAO - GenesisDAO'>
        <div className='flex justify-center py-3 pt-5'>
          <div>Connect Wallet First</div>
        </div>
      </MainLayout>
    );
  };

  if (!currentWalletAccount) {
    return noWallet();
  }
  if (!daosOwnedByWallet) {
    return (
      <MainLayout
        title='Manage Your DAO - GenesisDAO'
        description='Manage Your DAO - GenesisDAO'>
        <Spinner />
      </MainLayout>
    );
  }
  return (
    <MainLayout
      title='Manage Your DAO - GenesisDAO'
      description='Manage Your DAO - GenesisDAO'>
      <div className='py-3 pt-5'>
        <h1 className='mb-3 text-center text-3xl'>{`Here are the DAOS managed by you:`}</h1>
        <div className='overflow-x-auto p-5'></div>
      </div>
    </MainLayout>
  );
};

export default ManageDao;
