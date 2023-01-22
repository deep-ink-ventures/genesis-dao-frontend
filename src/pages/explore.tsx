import { useEffect } from 'react';

import DaoCard from '@/components/DaoCard';
import { Meta } from '@/components/Meta';
import useExtrinsics from '@/hooks/useExtrinsics';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const ExploreDaos = () => {
  const { getDaos } = useExtrinsics();
  const daos = useGenesisStore((s) => s.daos);
  const updateDaos = useGenesisStore((s) => s.updateDaos);

  const handleGetDaos = async () => {
    try {
      const allDaos = await getDaos();
      updateDaos(allDaos);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetDaos();
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
        <div className='slate-800 hero-content mb-5 rounded-xl text-center'>
          <div className='max-w-md'>
            <h1 className='text-3xl font-bold'>Explore Other DAOs</h1>
            <p className='py-6'>Check out other DAOs</p>
            <button
              className='btn-primary btn'
              onClick={() => {
                handleGetDaos();
              }}>
              Get Daos
            </button>
          </div>
        </div>
        <div className='space-between flex flex-wrap'>
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
