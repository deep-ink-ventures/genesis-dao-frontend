import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Congratulations from '@/components/Congratulations';
import CouncilTokens from '@/components/CouncilTokens';
import GovernanceForm from '@/components/GovernanceForm';
import LogoForm from '@/components/LogoForm';
import WalletConnect from '@/components/WalletConnect';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const Customize = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const fetchDao = useGenesisStore((s) => s.fetchDao);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const currentDaoFromChain = useGenesisStore((s) => s.currentDaoFromChain);
  const router = useRouter();
  const { daoId } = router.query;
  const isOwner =
    currentDao &&
    currentWalletAccount &&
    currentDao.daoOwnerAddress === currentWalletAccount.address;
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);

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

    if (!isOwner) {
      <div>
        <p>Sorry you are not the owner of {currentDao?.daoName}</p>
      </div>;
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
      !currentDao.setupComplete
    ) {
      return <CouncilTokens daoId={daoId as string} />;
    }

    if (
      currentDao &&
      (currentDao.setupComplete ||
        currentDao?.daoCreatorAddress !== currentDao?.daoOwnerAddress)
    ) {
      return <Congratulations daoId={daoId as string} />;
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

export default Customize;
