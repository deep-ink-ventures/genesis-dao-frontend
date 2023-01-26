import { useRouter } from 'next/router';

import { Meta } from '@/components/Meta';
import MainLayout from '@/templates/MainLayout';

const DaoHome = () => {
  const router = useRouter();
  const { daoId } = router.query;
  return (
    <MainLayout
      meta={
        <Meta
          title='GenesisDAO - DAO Platform On Polkadot'
          description='GenesisDAO Description'
        />
      }>
      <div className='hero mt-12'>
        <div className='hero-content rounded-xl bg-slate-800 text-center'>
          {daoId}
        </div>
      </div>
    </MainLayout>
  );
};

export default DaoHome;
