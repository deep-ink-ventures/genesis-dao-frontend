import { useRouter } from 'next/router';
import { useEffect } from 'react';

import TransferForm from '@/components/TransferForm';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const Tokens = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const [currentDao, fetchDaoFromDB] = useGenesisStore((s) => [
    s.currentDao,
    s.fetchDaoFromDB,
  ]);

  useEffect(() => {
    if (!daoId) {
      return;
    }
    fetchDaoFromDB(daoId as string);
  }, [daoId, fetchDaoFromDB]);

  if (!currentDao) {
    <MainLayout title='Tokens page for DAOS' description='Tokens page for DAOS'>
      <div>something is wrong</div>
    </MainLayout>;
  }

  if (!currentDao?.daoAssetId) {
    return (
      <MainLayout
        title='Tokens page for DAOS'
        description='Tokens page for DAOS'>
        <div className='mt-2 flex justify-center'>
          <h2>Please Issues Tokens first</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title='Tokens page for DAOS' description='Tokens page for DAOS'>
      <div className='hero mt-5'>
        <div className='hero-content rounded-xl bg-slate-800 text-center'>
          <div className='max-w-md'>
            <h1 className='text-3xl font-bold'>{`Transfer ${daoId} tokens`}</h1>
            <TransferForm
              assetId={currentDao.daoAssetId as number}
              daoId={daoId as string}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tokens;
