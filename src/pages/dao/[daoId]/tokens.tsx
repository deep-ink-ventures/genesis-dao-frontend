import { useRouter } from 'next/router';

import IssueTokensForm from '@/components/IssueTokensForm';
import MainLayout from '@/templates/MainLayout';

const Tokens = () => {
  const router = useRouter();
  const { daoId } = router.query;

  return (
    <MainLayout title='Tokens page for DAOS' description='Tokens page for DAOS'>
      <div>Manage Tokens here</div>
      <div className='hero mt-12'>
        <div className='hero-content rounded-xl bg-slate-800 text-center'>
          <div className='max-w-md'>
            <h1 className='text-3xl font-bold'>{`Issue Tokens for ${daoId}`}</h1>
            <IssueTokensForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tokens;
