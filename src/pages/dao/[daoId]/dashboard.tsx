import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import useGenesisStore from '@/stores/genesisStore';
import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import MainLayout from '@/templates/MainLayout';

const Dashboard = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const currentDao = useGenesisStore((s) => s.currentDao);
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const fetchDao = useGenesisStore((s) => s.fetchDao);

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
      <div className='mt-12 flex min-h-[500px] justify-between gap-x-4'>
        <div className='container flex basis-1/4 flex-col items-center justify-evenly'>
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
          <div>
            <div>Tokens</div>
          </div>
          <div>
            <div>Dashboard</div>
            <div>Proposals</div>
            <div>About</div>
            <div>Settings</div>
          </div>
        </div>
        <div className='container basis-3/4'></div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
