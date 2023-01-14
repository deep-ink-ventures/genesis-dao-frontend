import { Meta } from '@/components/Meta';
import MainLayout from '@/templates/MainLayout';

const Index = () => {
  return (
    <MainLayout
      meta={
        <Meta
          title='GenesisDAO'
          description='GenesisDAO Description'
          siteName='GenesisDAO'
        />
      }>
      <h1>Genesis DAO</h1>
      <div>eric</div>
    </MainLayout>
  );
};

export default Index;
