import { Meta } from '@/components/Meta';
import MainLayout from '@/templates/MainLayout';

const CreateDao = () => {
  return (
    <MainLayout
      meta={
        <Meta
          title='Create a DAO - GenesisDAO'
          description='Create DAO - GenesisDAO'
        />
      }>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <h1 className='text-5xl font-bold'>Hello there</h1>
            <p className='py-6'>
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className='btn-primary btn'>Get Started</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateDao;
