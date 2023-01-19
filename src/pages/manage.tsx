import { Meta } from '@/components/Meta';
import MainLayout from '@/templates/MainLayout';

const ManageDao = () => {
  return (
    <MainLayout
      meta={
        <Meta
          title='Manage Your DAO - GenesisDAO'
          description='Manage Your DAO - GenesisDAO'
        />
      }>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <h1 className='text-5xl font-bold'>Manage DAOs</h1>
            <p className='py-6'>You can manager DAOs here</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManageDao;
