import { useRouter } from 'next/router';
import { useEffect } from 'react';

import CreateProposal from '@/components/CreateProposal';
import WalletConnect from '@/components/WalletConnect';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const Proposal = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  // const daoTokenBalance = useGenesisStore((s) => s.daoTokenBalance);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  // const fetchDaoTokenBalanceFromDB = useGenesisStore(
  //   (s) => s.fetchDaoTokenBalanceFromDB
  // );
  const router = useRouter();
  const { daoId } = router.query;

  // const handleReturnToDashboard = () => {
  //   router.push(`/dao/${encodeURIComponent(daoId as string)}`);
  // };

  useEffect(() => {
    if (!daoId) {
      return;
    }
    console.log('useeffect');
    const TO = setTimeout(() => {
      fetchDaoFromDB(daoId as string);
    }, 700);
    // eslint-disable-next-line
    return () => clearTimeout(TO);
  }, [daoId, fetchDaoFromDB]);

  const display = () => {
    if (!currentWalletAccount?.address) {
      return (
        <div className='flex flex-col items-center justify-center'>
          <p className='text-center'>
            Please connect wallet to continue creating a new Proposal{' '}
            {currentDao?.daoName}
          </p>
          <WalletConnect text='Connect Wallet To Continue' />
        </div>
      );
    }
    // need to validate whether this account has dao tokens

    return <CreateProposal dao={currentDao} />;
  };

  return (
    <MainLayout
      title='Create a DAO - GenesisDAO'
      description='Create a DAO - GenesisDAO'>
      <div className='container mx-auto mt-5 min-h-[600px] min-w-[600px] max-w-[820px] px-12 py-5'>
        {display()}
      </div>
    </MainLayout>
  );
};

export default Proposal;
