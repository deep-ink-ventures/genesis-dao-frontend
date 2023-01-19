import Link from 'next/link';

import { Meta } from '@/components/Meta';
import MainLayout from '@/templates/MainLayout';

const Index = () => {
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
          <div className='max-w-md'>
            <h3 className='text-5xl font-bold'>Welcome to Genesis DAO</h3>
            <p className='py-6'>Here you can create your own DAO</p>
            <Link href='/createdao' className='border-none hover:text-gray-900'>
              <button className='btn-primary btn'>Create Dao</button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
