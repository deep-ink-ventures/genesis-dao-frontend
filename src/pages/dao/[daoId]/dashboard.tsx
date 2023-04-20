import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import useGenesisStore from '@/stores/genesisStore';
import about from '@/svg/about.svg';
import arrowLeft from '@/svg/arrow-left.svg';
import arrowRight from '@/svg/arrow-right.svg';
import dashboard from '@/svg/dashboard.svg';
import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import plusBlack from '@/svg/plus-black.svg';
import proposal from '@/svg/proposal.svg';
import settings from '@/svg/settings.svg';
import MainLayout from '@/templates/MainLayout';

const Dashboard = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const [page, setPage] = useState('proposals');
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const fetchDao = useGenesisStore((s) => s.fetchDao);

  const handleChangePage = (pageParam: string) => {
    setPage(pageParam);
  };

  // const isOwner =
  //   currentDao &&
  //   currentWalletAccount &&
  //   currentDao.daoOwnerAddress === currentWalletAccount.address;

  useEffect(() => {
    if (!daoId) {
      return;
    }
    fetchDaoFromDB(daoId as string);
    fetchDao(daoId as string);
  }, [daoId, fetchDaoFromDB, fetchDao, currentWalletAccount]);

  const handleReturnToDashboard = () => {
    router.push(`/dao/${encodeURIComponent(daoId as string)}`);
  };

  const handleSearch = () => {};

  const handleCreateProposal = () => {};

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

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO - Create a DAO'>
      <div
        className='mt-5 flex w-[65px] items-center justify-between hover:cursor-pointer hover:underline'
        onClick={handleReturnToDashboard}>
        <Image src={arrowLeft} width={13} height={7} alt='arrow-left' />
        <div>Back</div>
      </div>
      <div className='mt-5 flex min-h-[500px] justify-between gap-x-4'>
        <div className='container flex max-h-[640px] basis-1/4 flex-col items-center justify-evenly gap-y-4 py-4'>
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
          <div className='flex justify-center py-3 '>
            <div className='flex h-[75px] w-[220px] items-center justify-between rounded-xl bg-base-50 px-4'>
              <div>
                <p>Tokens Owned</p>
                {!currentWalletAccount?.address ? (
                  <p className='text-primary underline'>Connect Wallet</p>
                ) : (
                  <p>10 Tokens</p>
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
          </div>
          <div className='w-full'>
            <div className='flex h-[55px] py-4 px-7 brightness-75'>
              <Image
                src={dashboard}
                height={15}
                width={15}
                alt='dashboard'
                className='mr-4'
              />
              <p>Dashboard</p>
            </div>
            <div
              className={`${
                page === 'proposals' ? 'selected-tab' : ''
              } flex h-[55px] border-r-4 border-primary py-4 px-7 hover:cursor-pointer`}>
              <Image
                src={proposal}
                height={15}
                width={15}
                alt='dashboard'
                className='mr-4'
                onClick={() => handleChangePage('proposals')}
              />
              <p>Proposals</p>
            </div>
            <div className={`flex h-[55px] py-4 px-7 brightness-75`}>
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
            </div>
          </div>
        </div>
        <div className='container flex basis-3/4 flex-col gap-y-4 p-5'>
          <div className='flex justify-between'>
            <div className='flex items-center'>
              <h1 className='text-2xl'>Proposals</h1>
            </div>
            <div className='flex gap-x-4'>
              <div>
                <input
                  id='search-input'
                  className='input-primary input w-72 text-sm'
                  placeholder='Search Proposals'
                  onChange={handleSearch}
                />
              </div>
              <div className='flex items-center justify-center'>
                <div className='flex h-12 min-w-[68px] items-center justify-center rounded-full border'>
                  All
                </div>
              </div>
              <div>
                <button
                  className='btn-primary btn flex items-center gap-x-1'
                  onClick={handleCreateProposal}>
                  <Image src={plusBlack} height={16} width={16} alt='plus' />
                  <p className='flex items-center pt-[1px]'>New Proposal</p>
                </button>
              </div>
            </div>
          </div>
          <div>all proposals cards</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
