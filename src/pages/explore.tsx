import { useEffect, useState } from 'react';

import DaoCard from '@/components/DaoCard';
import Spinner from '@/components/Spinner';
import type { DaoInfo } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

import { truncateMiddle } from '../utils/utils';

const DaoCards = ({ daos }: { daos: DaoInfo[] | null }) => {
  return daos && daos.length > 0 ? (
    <>
      {daos.map((dao) => {
        return (
          <DaoCard
            key={dao.daoId}
            daoId={dao.daoId}
            daoName={dao.daoName}
            owner={truncateMiddle(dao.owner)}
          />
        );
      })}
    </>
  ) : (
    <div>
      <Spinner />
    </div>
  );
};

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

  const handleFilterDaos = (event: any) => {
    setFilterDaosOwned(!filterDaosOwned);
  };

  useEffect(() => {
    fetchDaos();
    console.log('all daos', daos, 'daos owned', daosOwnedByWallet);
  }, []);

  useEffect(() => {
    if (typeof currentWalletAccount !== undefined) {
      updateDaosOwnedByWallet();
    }
  }, [currentWalletAccount]);

  return (
    <MainLayout
      title='Explore DAOs - GenesisDAO'
      description='GenesisDAO Description'>
      <div>
        <div>
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
        </div>
        <div className='hero mt-12'>
          <div className='flex flex-wrap'>
            <DaoCards daos={filterDaosOwned ? daosOwnedByWallet : daos} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExploreDaos;
