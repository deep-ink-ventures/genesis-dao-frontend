import { Meta } from '@/components/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title='GenesisDAO'
          description='GenesisDAO Description'
          siteName='GenesisDAO'
        />
      }>
      <h1>Genesis DAO</h1>
    </Main>
  );
};

export default Index;
