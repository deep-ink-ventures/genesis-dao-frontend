import { useRouter } from 'next/router';

import IssueTokensForm from '@/components/IssueTokensForm';
import TransferForm from '@/components/TransferForm';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const Tokens = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const daos = useGenesisStore((s) => s.daos);
  if (!daos) {
    <MainLayout title='Tokens page for DAOS' description='Tokens page for DAOS'>
      <div>something is wrong</div>
    </MainLayout>;
  }

  if (!daos?.[daoId as string]?.assetId) {
    return (
      <MainLayout
        title='Tokens page for DAOS'
        description='Tokens page for DAOS'>
        <div className='mt-2 flex justify-center'>
          <h2>Please Issues Tokens first</h2>
        </div>

        <div className='hero mt-5'>
          <div className='hero-content rounded-xl bg-slate-800 text-center'>
            <div className='max-w-md'>
              <h1 className='mb-2 text-3xl font-bold'>{`Issue Tokens for ${daoId}`}</h1>
              <IssueTokensForm daoId={daoId as string} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title='Tokens page for DAOS' description='Tokens page for DAOS'>
      <div className='hero mt-5'>
        <div className='hero-content rounded-xl bg-slate-800 text-center'>
          <div className='max-w-md'>
            <h1 className='text-3xl font-bold'>{`Transfer ${daoId} tokens`}</h1>
            <TransferForm
              assetId={daos?.[daoId as string]?.assetId as number}
              daoId={daoId as string}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tokens;
