import GovernanceForm from '@/components/GovernanceForm';
import LogoForm from '@/components/LogoForm';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const Start = () => {
  const createDaoSteps = useGenesisStore((s) => s.createDaoSteps);

  const display = () => {
    if (createDaoSteps === 1) {
      return <LogoForm />;
    }
    if (createDaoSteps === 2) {
      return <GovernanceForm />;
    }
    return null;
  };

  return (
    <MainLayout
      title='Create a DAO - GenesisDAO'
      description='Create a DAO - GenesisDAO'>
      <div className='container mx-auto mt-5 min-w-[600px] max-w-[820px] px-12 py-5'>
        {display()}
      </div>
    </MainLayout>
  );
};

export default Start;
