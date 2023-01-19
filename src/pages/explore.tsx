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
      <div className='hero mt-12'>
        <div className='hero-content rounded-xl bg-slate-800 text-center'>
          <div className='max-w-md'>
            <h1 className='text-3xl font-bold'>Explore Other DAOs</h1>
            <p className='py-6'>Check out other DAOs</p>
            <button className='btn-primary btn'>Explore DAO</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExploreDaos;
