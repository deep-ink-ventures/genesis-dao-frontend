import { useRouter } from 'next/router';

import Congratulations from '@/components/Congratulations';
import Council from '@/components/Council';
import GovernanceForm from '@/components/GovernanceForm';
import IssueTokens from '@/components/IssueTokens';
import LogoForm from '@/components/LogoForm';
import Review from '@/components/Review';
import WalletConnect from '@/components/WalletConnect';
import useGenesisStore from '@/stores/genesisStore';
import MainLayout from '@/templates/MainLayout';

const Customize = () => {
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const router = useRouter();
  const { daoId } = router.query;
  const daos = useGenesisStore((s) => s.daos);
  const dao = daos?.[daoId as string];
  const isOwner =
    dao && currentWalletAccount && dao.owner === currentWalletAccount.address;

  const createDaoSteps = useGenesisStore((s) => s.createDaoSteps);

  const display = () => {
    if (!currentWalletAccount?.address) {
      return (
        <div>
          <p>Please connect wallet to continue customizing {dao?.daoName}</p>
          <WalletConnect text='Connect Wallet To Continue' />
        </div>
      );
    }

    if (!isOwner) {
      <div>
        <p>Sorry you are not the owner of {dao?.daoName}</p>
      </div>;
    }

    if (createDaoSteps === 1) {
      return <LogoForm daoId={dao?.daoId || null} />;
    }
    if (createDaoSteps === 2) {
      return <GovernanceForm daoId={dao?.daoId || null} />;
    }
    if (createDaoSteps === 3) {
      return <Council daoId={dao?.daoId || null} />;
    }
    if (createDaoSteps === 4) {
      return <IssueTokens daoId={dao?.daoId || null} />;
    }
    if (createDaoSteps === 5) {
      return <Review daoId={dao?.daoId || null} />;
    }
    if (createDaoSteps === 6) {
      return <Congratulations />;
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
