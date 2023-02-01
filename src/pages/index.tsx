import Link from 'next/link';

import MainLayout from '@/templates/MainLayout';

const Index = () => {
  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO Description'>
      <div className='hero mt-12'>
        <div className='hero-content rounded-xl bg-slate-800 text-center'>
          <div className='max-w-md'>
            <h1 className='text-3xl font-bold'>Welcome to Genesis DAO</h1>
            <p className='py-6'>Here you can create your own DAO</p>
            <Link href='/create' className='border-none hover:text-gray-900'>
              <button className='btn-primary btn'>Create Dao</button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
