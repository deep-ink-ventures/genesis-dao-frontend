import TransferForm from '@/components/TransferForm';
import MainLayout from '@/templates/MainLayout';

const Tokens = () => {
  return (
    <MainLayout
      title='Transfer Tokens - GenesisDAO'
      description='Transfer Tokens - GenesisDAO'>
      <div className='hero mt-12'>
        <div className='hero-content rounded-xl bg-slate-800 text-center'>
          <div className='max-w-md'>
            <h1 className='mb-2 text-3xl font-bold'>Transfer DAO Tokens</h1>
            <TransferForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tokens;
