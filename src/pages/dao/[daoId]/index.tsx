import Link from 'next/link';
import { useRouter } from 'next/router';

import MainLayout from '@/templates/MainLayout';

import useGenesisStore from '../../../stores/genesisStore';

const DaoHome = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO Description'>
      <div>{!currentWalletAccount ? `Connect Wallet to manage dao` : null}</div>
      <div className='space-between mt-12 flex'>
        <div className='hero mt-3 p-2'>
          <div className='hero-content flex-col rounded-xl bg-slate-800 text-center'>
            <h3>Dao ID : {daoId}</h3>
            <p>blah blah blah description maybe some social media icons</p>
          </div>
        </div>
        <div className='hero '>
          <div className='hero-content flex-col rounded-xl bg-slate-800 text-center'>
            Manage Tokens
            <Link href={`/dao/${encodeURIComponent(daoId as string)}/tokens`}>
              <button className='btn-primary btn'>Manage Tokens</button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DaoHome;
