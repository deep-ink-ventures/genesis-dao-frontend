import { useEffect, useState } from 'react';

import DaoCards from '@/components/DaoCards';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

// fixme sometimes the filter toggle doesn't show
const ExploreDaos = () => {
  const daos = useGenesisStore((s) => s.daos);
  const fetchDaos = useGenesisStore((s) => s.fetchDaos);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const daosOwnedByWallet = useGenesisStore((s) => s.daosOwnedByWallet);
  const updateDaosOwnedByWallet = useGenesisStore(
    (s) => s.updateDaosOwnedByWallet
  );
  const [filterDaosOwned, setFilterDaosOwned] = useState(false);

  const handleFilterDaos = () => {
    setFilterDaosOwned(!filterDaosOwned);
  };

  const handleRefresh = () => {
    fetchDaos();
  };

  useEffect(() => {
    fetchDaos();
  }, [fetchDaos]);

  useEffect(() => {
    if (currentWalletAccount?.address) {
      updateDaosOwnedByWallet();
    }
  }, [currentWalletAccount, updateDaosOwnedByWallet]);

  if (!daos) {
    return (
      <MainLayout
        title='Explore DAOs - GenesisDAO'
        description='GenesisDAO Description'>
        <div>No DAOS created yet</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title='Explore DAOs - GenesisDAO'
      description='GenesisDAO Description'>
      <div className='p-4'>
        <div className='flex justify-center'>
          {daosOwnedByWallet && daosOwnedByWallet.length > 1 ? (
            <div className='form-control w-52'>
              <label className='label cursor-pointer'>
                <span className='label-text'>Show DAOs you owned</span>
                <input
                  type='checkbox'
                  className='toggle-primary toggle'
                  checked={filterDaosOwned}
                  onChange={handleFilterDaos}
                />
              </label>
            </div>
          ) : null}
          <div>
            <button className='btn-primary btn' onClick={handleRefresh}>
              Refresh
            </button>
          </div>
        </div>
        <DaoCards
          daos={filterDaosOwned ? daosOwnedByWallet : Object.values(daos)}
        />
      </div>
    </MainLayout>
  );
};

export default ExploreDaos;
