import { Meta } from '@/components/Meta';
import useExtrinsics from '@/hooks/useExtrinsics';
import MainLayout from '@/templates/MainLayout';

const ManageDao = () => {
  const { getDaos } = useExtrinsics();

  const handleGetDaos = () => {
    getDaos();
  };

  return (
    <MainLayout
      meta={
        <Meta
          title='Manage Your DAO - GenesisDAO'
          description='Manage Your DAO - GenesisDAO'
        />
      }>
      <div className='hero mt-12'>
        <div className='hero-content rounded-xl bg-slate-800 text-center'>
          <div className='max-w-md'>
            <h1 className='text-3xl font-bold'>Manage Your DAOs</h1>
            <p className='py-6'>Click here to manager your dao</p>
            <button className='btn-primary btn' onClick={handleGetDaos}>
              Get Daos
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManageDao;
