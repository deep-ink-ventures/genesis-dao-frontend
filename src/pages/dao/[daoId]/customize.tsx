import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Congratulations from '@/components/Congratulations';
import CouncilTokens from '@/components/CouncilTokens';
import GovernanceForm from '@/components/GovernanceForm';
import Loading from '@/components/Loading';
import LogoForm from '@/components/LogoForm';
import WalletConnect from '@/components/WalletConnect';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const Customize = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const showCongrats = useGenesisStore((s) => s.showCongrats);
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const fetchDao = useGenesisStore((s) => s.fetchDao);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const currentDaoFromChain = useGenesisStore((s) => s.currentDaoFromChain);
  const router = useRouter();
  const { daoId } = router.query;
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const [showPage, setShowPage] = useState(false);

  const handleReturnToDashboard = () => {
    router.push(`/dao/${encodeURIComponent(daoId as string)}`);
  };

  useEffect(() => {
    if (!daoId) {
      return;
    }
    const TO = setTimeout(() => {
      fetchDaoFromDB(daoId as string);
      fetchDao(daoId as string);
    }, 700);
    // eslint-disable-next-line
    return () => clearTimeout(TO);
  }, [daoId, fetchDaoFromDB, fetchDao, txnProcessing]);

  useEffect(() => {
    setTimeout(() => {
      return setShowPage(true);
    }, 1500);
  }, []);

  const display = () => {
    if (!currentWalletAccount?.address) {
      return (
        <div className='flex flex-col items-center'>
          <p>
            Please connect wallet to continue customizing {currentDao?.daoName}
          </p>
          <WalletConnect text='Connect Wallet To Continue' />
        </div>
      );
    }
    if (
      currentWalletAccount.address !== currentDao?.daoOwnerAddress &&
      !showCongrats
    ) {
      return (
        <div className='flex justify-center'>
          <div className='flex flex-col items-center'>
            <p className='my-2'>
              Sorry, you are not the admin of {currentDao?.daoName}
            </p>
            <p className='my-2'>
              If you have recently created a new DAO. Please check back in a few
              moments.
            </p>
            <button
              className='btn-primary btn'
              onClick={handleReturnToDashboard}>
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    if (!currentDaoFromChain?.metadataHash) {
      return <LogoForm daoId={daoId as string} />;
    }

    if (
      currentDao &&
      currentDaoFromChain.metadataHash &&
      !currentDaoFromChain.daoAssetId
    ) {
      return <GovernanceForm daoId={daoId as string} />;
    }

    if (
      currentDao &&
      currentDaoFromChain.metadataHash &&
      currentDaoFromChain.daoAssetId &&
      !currentDao.setupComplete &&
      !showCongrats
    ) {
      return <CouncilTokens daoId={daoId as string} />;
    }

    if ((currentDao && currentDao.setupComplete) || showCongrats) {
      return <Congratulations daoId={daoId as string} />;
    }
    return null;
  };

  return (
    <MainLayout
      title='Create a DAO - GenesisDAO'
      description='Create a DAO - GenesisDAO'>
      <div className='container mx-auto mt-5 min-w-[600px] max-w-[820px] px-12 py-5'>
        {showPage && display()}
        {!showPage && <Loading />}
      </div>
    </MainLayout>
  );
};

export default Customize;
