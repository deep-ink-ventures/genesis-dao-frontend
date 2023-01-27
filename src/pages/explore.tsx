import { useEffect, useState } from 'react';

import DaoCard from '@/components/DaoCard';
import { Meta } from '@/components/Meta';
import Spinner from '@/components/Spinner';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

import { truncateMiddle } from '../utils/utils';

const ExploreDaos = () => {
  const daos = useGenesisStore((s) => s.daos);
  const fetchDaos = useGenesisStore((s) => s.fetchDaos);
  const [filterDaosOwned, setFilterDaosOwned] = useState(false);

  const handleFilterDaos = (event: any) => {
    setFilterDaosOwned(!filterDaosOwned);
    console.log(event.target.checked);
  };

  useEffect(() => {
    fetchDaos();
  }, []);

  useEffect(() => {
    console.log('filter?', filterDaosOwned);
  }, [filterDaosOwned]);

  return (
    <MainLayout
      meta={
        <Meta
          title='Explore DAOs - GenesisDAO'
          description='GenesisDAO Description'
        />
      }>
      <div>
        <div>
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
        </div>
        <div className='hero mt-12'>
          <div className='flex flex-wrap'>
            {daos && daos.length > 0 ? (
              daos.map((dao) => {
                return (
                  <DaoCard
                    key={dao.daoId}
                    daoId={dao.daoId}
                    daoName={dao.daoName}
                    owner={truncateMiddle(dao.owner)}
                  />
                );
              })
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExploreDaos;
