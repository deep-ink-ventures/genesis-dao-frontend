import { Meta } from '@/components/Meta';
import MainLayout from '@/templates/MainLayout';

const ExploreDaos = () => {
  return (
    <MainLayout
      meta={
        <Meta
          title='Explore DAOs - GenesisDAO'
          description='GenesisDAO Description'
        />
      }>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <h1 className='text-5xl font-bold'>Explore Daos here</h1>
            <p className='py-6'>
              You can check out all the DAOS created on this platform
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExploreDaos;
