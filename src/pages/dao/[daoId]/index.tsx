import { BN } from '@polkadot/util';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import DaoDashboard from '@/components/DaoDashboard';
import Governance from '@/components/Governance';
import Proposals from '@/components/Proposals';
import Spinner from '@/components/Spinner';
import Transactions from '@/components/Transactions';
import WalletConnect from '@/components/WalletConnect';
import type { DaoPage } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import governanceIcon from '@/svg/about.svg';
import arrowLeft from '@/svg/arrow-left.svg';
import arrowRight from '@/svg/arrow-right.svg';
import dashboard from '@/svg/dashboard.svg';
import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import proposal from '@/svg/proposal.svg';
import switchIcon from '@/svg/switch.svg';
import MainLayout from '@/templates/MainLayout';
import { uiTokens } from '@/utils';

enum DashboardTabs {
  DASHBOARD = 'dashboard',
  PROPOSALS = 'proposals',
  TRANSACTIONS = 'transactions',
  GOVERNANCE = 'governance',
}

const TabButton = ({
  activeTab,
  name,
  children,
  onClick,
}: {
  activeTab?: string;
  name: string;
  children: React.ReactNode;
  onClick: (tab?: string) => void;
}) => {
  return (
    <div
      className={`${
        activeTab === name ? 'selected-tab' : 'brightness-75'
      } flex h-[55px] px-7 py-4 hover:cursor-pointer hover:text-primary`}
      onClick={() => onClick(name)}>
      {children}
    </div>
  );
};

const MainDaoPage = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const [
    daoPage,
    currentWalletAccount,
    currentDao,
    daoTokenBalance,
    fetchDaoFromDB,
    fetchDao,
    fetchDaoTokenBalanceFromDB,
    updateDaoPage,
    daoTokenTreasuryBalance,
    fetchDaoTokenTreasuryBalance,
    page,
  ] = useGenesisStore((s) => [
    s.daoPage,
    s.currentWalletAccount,
    s.currentDao,
    s.daoTokenBalance,
    s.fetchDaoFromDB,
    s.fetchDao,
    s.fetchDaoTokenBalanceFromDB,
    s.updateDaoPage,
    s.daoTokenTreasuryBalance,
    s.fetchDaoTokenTreasuryBalance,
    s.pages.dao,
  ]);

  const [showSpinner, setShowSpinner] = useState(true);

  const isAdmin =
    Boolean(currentWalletAccount?.address) &&
    currentDao?.adminAddresses?.some(
      (approver) =>
        approver.toLowerCase() === currentWalletAccount?.address.toLowerCase()
    );

  const handleChangePage = (pageParam: DaoPage) => {
    updateDaoPage(pageParam);
  };

  useEffect(() => {
    if (!daoId) {
      return;
    }
    fetchDaoFromDB(daoId as string);
  }, [daoId, fetchDaoFromDB, fetchDao]);

  useEffect(() => {
    setShowSpinner(true);
    const timeout1 = setTimeout(() => {
      if (!currentDao?.daoAssetId || !currentWalletAccount?.address) {
        return;
      }
      fetchDaoTokenTreasuryBalance(
        currentDao.daoAssetId,
        currentDao.daoOwnerAddress
      );
      fetchDaoTokenBalanceFromDB(
        currentDao.daoAssetId,
        currentWalletAccount.address
      );
    }, 200);
    const timeout2 = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [currentDao, currentWalletAccount]);

  useEffect(() => {
    updateDaoPage('dashboard');
    page.stats.pendingMultisig.fetch();
  }, [currentWalletAccount]);

  const displayImage = () => {
    if (!currentDao || !currentDao.images.medium) {
      return (
        <div className='relative flex items-center justify-center'>
          <Image
            src={placeholderImage}
            alt='placeholder'
            height={120}
            width={120}
          />
          <div className='absolute'>
            <Image src={mountain} alt='mountain' width={30} height={17}></Image>
          </div>
        </div>
      );
    }
    return (
      <div className='relative flex items-center justify-center'>
        {/* fixme for Next Image */}
        <img
          src={currentDao.images.medium}
          alt={`${currentDao.daoName} logo image`}
          height={120}
          width={120}
          className='rounded-full'
        />
      </div>
    );
  };

  const displayPage = () => {
    switch (daoPage) {
      case DashboardTabs.PROPOSALS:
        return <Proposals daoId={daoId as string} />;
      case DashboardTabs.TRANSACTIONS:
        return <Transactions daoId={daoId as string} />;
      case DashboardTabs.GOVERNANCE:
        return <Governance />;
      default:
        return <DaoDashboard />;
    }
  };

  const handleBack = () => {
    router.push(`/#explorer`);
  };

  return (
    <MainLayout
      title={`${currentDao?.daoName} - GenesisDAO - DAO Platform On Polkadot'`}
      description={`${currentDao?.daoName} - Create a DAO`}>
      <div
        className='mt-5 flex w-[65px] items-center justify-between hover:cursor-pointer hover:underline'
        onClick={handleBack}>
        <Image src={arrowLeft} width={13} height={7} alt='arrow-left' />
        <div>Back</div>
      </div>

      {!currentDao || currentDao.daoId !== daoId ? (
        <Spinner />
      ) : (
        <div className='mt-5 flex min-h-[500px] justify-between gap-x-4'>
          <div className='container flex h-[640px] basis-1/4 flex-col items-center justify-evenly gap-y-4 py-4'>
            <div className='flex flex-col items-center justify-center'>
              <div>{displayImage()}</div>
              <div className='mt-3 flex flex-col items-center md:overflow-visible'>
                <h4
                  className={`z-10 inline-block w-[150px] truncate text-center text-lg text-base-content mix-blend-normal ${
                    currentDao && currentDao?.daoName?.length > 20
                      ? 'text-base'
                      : ''
                  }`}>
                  {currentDao?.daoName}
                </h4>
                <p className='text-center text-accent'>{`DAO ID: ${currentDao?.daoId}`}</p>
              </div>
            </div>
            <div className='flex justify-center pt-3'>
              {!currentWalletAccount?.address ? (
                <WalletConnect text='Connect to view tokens' />
              ) : (
                <div className='flex h-[80px] w-[240px] items-center justify-between rounded-xl bg-base-50 px-4'>
                  <div className='px-5 text-center text-sm'>
                    {showSpinner ? (
                      <Spinner size='22' />
                    ) : (
                      <div className='flex flex-col'>
                        <p>You have</p>
                        <p>
                          {uiTokens(daoTokenBalance, 'dao', currentDao?.daoId)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Image
                      src={arrowRight}
                      width={12}
                      height={6}
                      alt='arrow-right'
                    />
                  </div>
                </div>
              )}
            </div>
            <div className='flex justify-center pb-3'>
              <div className='flex h-[80px] w-[240px] items-center justify-between rounded-xl bg-base-50 px-4'>
                <div className='flex justify-center px-5 text-center text-sm'>
                  {showSpinner ? (
                    <Spinner size='22' />
                  ) : (
                    <div className='flex flex-col'>
                      <p>Treasury</p>
                      <p>
                        {uiTokens(
                          daoTokenTreasuryBalance || new BN(0),
                          'dao',
                          currentDao?.daoId
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='w-full'>
              <TabButton
                name={DashboardTabs.DASHBOARD}
                activeTab={daoPage || DashboardTabs.DASHBOARD}
                onClick={() => handleChangePage('dashboard')}>
                <Image
                  src={dashboard}
                  height={15}
                  width={15}
                  alt='dashboard'
                  className='mr-4'
                />
                <p>Dashboard</p>
              </TabButton>
              <TabButton
                name={DashboardTabs.PROPOSALS}
                activeTab={daoPage}
                onClick={() => handleChangePage('proposals')}>
                <Image
                  src={proposal}
                  height={15}
                  width={15}
                  alt='dashboard'
                  className='mr-4'
                />
                <p>Proposals</p>
              </TabButton>
              {isAdmin && (
                <TabButton
                  name={DashboardTabs.TRANSACTIONS}
                  activeTab={daoPage}
                  onClick={() => handleChangePage('transactions')}>
                  <Image
                    src={switchIcon}
                    height={15}
                    width={15}
                    alt='dashboard'
                    className='mr-4'
                  />
                  <div className='flex items-center justify-center gap-2'>
                    <p>Transactions</p>
                    {Boolean(page.stats.pendingMultisig.count) && (
                      <div className='flex aspect-square items-center justify-center overflow-hidden rounded-full bg-secondary p-2 text-white'>
                        {page.stats.pendingMultisig.count}
                      </div>
                    )}
                  </div>
                </TabButton>
              )}
              {currentWalletAccount?.address &&
                currentDao.setupComplete &&
                currentDao.adminAddresses.find((v) => {
                  return v === currentWalletAccount.address;
                }) && (
                  <TabButton
                    name={DashboardTabs.GOVERNANCE}
                    activeTab={daoPage}
                    onClick={() => handleChangePage('governance')}>
                    <Image
                      src={governanceIcon}
                      height={15}
                      width={15}
                      alt='governance'
                      className='mr-4'
                    />
                    <p>Governance</p>
                  </TabButton>
                )}

              {/* <div className={`flex h-[55px] py-4 px-7 brightness-75`}>
                <Image
                  src={about}
                  height={15}
                  width={15}
                  alt='dashboard'
                  className='mr-4'
                />
                <p>About</p>
              </div>
              <div className='flex h-[55px] py-4 px-7 brightness-75'>
                <Image
                  src={settings}
                  height={15}
                  width={15}
                  alt='dashboard'
                  className='mr-4'
                />
                <p>Settings</p>
              </div> */}
            </div>
          </div>
          <div className='min-w-0 basis-3/4 p-5 pt-0'>
            {!currentDao || currentDao.daoId !== daoId ? (
              <Spinner />
            ) : (
              displayPage()
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default MainDaoPage;
