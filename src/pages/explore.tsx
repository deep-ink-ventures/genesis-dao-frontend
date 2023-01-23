import { useEffect } from 'react';

import DaoCard from '@/components/DaoCard';
import { Meta } from '@/components/Meta';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

// fix fix hydration issue
const ExploreDaos = () => {
  const daos = useGenesisStore((s) => s.daos);
  const fetchDaos = useGenesisStore((s) => s.fetchDaos);

  useEffect(() => {
    fetchDaos();
  }, []);

  return (
    <MainLayout
      meta={
        <Meta
          title='Explore DAOs - GenesisDAO'
          description='GenesisDAO Description'
        />
      }>
      <div className='hero mt-12'>
        <div className='flex flex-wrap'>
          {daos && daos.length > 0 ? (
            daos.map((dao) => {
              return (
                <DaoCard
                  key={dao.daoId}
                  daoId={dao.daoId}
                  daoName={dao.daoName}
                  owner={dao.owner}
                />
              );
            })
          ) : (
            <div>{`no daos`}</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExploreDaos;
