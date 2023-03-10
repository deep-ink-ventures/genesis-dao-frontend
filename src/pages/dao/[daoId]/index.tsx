import Link from 'next/link';
import { useRouter } from 'next/router';

import DestroyDao from '@/components/DestroyDao';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';
import { truncateMiddle } from '@/utils';

const DaoHome = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const daos = useGenesisStore((s) => s.daos);
  const dao = daos?.[daoId as string];
  const isOwner =
    dao && currentWalletAccount && dao.owner === currentWalletAccount.address;

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO Description'>
      <div className='mt-12 flex'>
        <div className='hero mt-3 p-2'>
          <div className='flex flex-col rounded-xl bg-slate-800 p-5'>
            <h1 className='mb-2'>
              <span>DAO NAME: </span> {dao?.daoName}
            </h1>
            <p className='mb-2'>
              <span className='font-bold'>DAO ID : </span> {dao?.daoId}
            </p>
            <p className='mb-2'>
              <span className='font-bold'>Asset ID: </span>{' '}
              {dao?.assetId ? dao?.assetId : 'Tokens not issued yet'}{' '}
            </p>
            <p className='mb-2'>
              <span className='font-bold'>Asset Symbol: </span> {dao?.daoId}
            </p>
            <p className='mb-2'>
              <span className='font-bold'>DAO Owner: </span>{' '}
              {truncateMiddle(dao?.owner)}
            </p>
            <p className='mb-2'>
              <span>This is a very cool DAO</span>
            </p>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='hero mb-4'>
            <div className='hero-content flex-col rounded-xl bg-slate-800 text-center'>
              <Link
                href={`/dao/${encodeURIComponent(daoId as string)}/tokens`}
                className={`${!currentWalletAccount ? 'disable-link' : ''}`}>
                <button
                  className={`btn-primary btn`}
                  disabled={!currentWalletAccount}>
                  Manage Tokens
                </button>
              </Link>
            </div>
          </div>
          <div className='hero mb-4'>
            <div className='hero-content flex-col rounded-xl bg-slate-800 text-center'>
              {dao && isOwner && (
                <DestroyDao daoId={dao?.daoId} assetId={dao?.assetId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DaoHome;
