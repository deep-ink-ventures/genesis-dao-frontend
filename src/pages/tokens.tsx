import TransferForm from '@/components/TransferForm';
import MainLayout from '@/templates/MainLayout';

const Tokens = () => {
  return (
    <MainLayout
      title='Transfer Tokens - GenesisDAO'
      description='Transfer Tokens - GenesisDAO'>
      <div>
        <div></div>
        <TransferForm />
      </div>
    </MainLayout>
  );
};

export default Tokens;
