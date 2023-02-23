import LogoForm from '@/components/LogoForm';
import MainLayout from '@/templates/MainLayout';

const Start = () => {
  return (
    <MainLayout
      title='Create a DAO - GenesisDAO'
      description='Create a DAO - GenesisDAO'>
      <div className='container mx-auto mt-12 min-w-[600px] max-w-[820px] px-14 py-5'>
        <LogoForm />
      </div>
    </MainLayout>
  );
};

export default Start;
