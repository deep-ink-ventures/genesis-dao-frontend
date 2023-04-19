import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import DestroyDao from '@/components/DestroyDao';
import useGenesisStore from '@/stores/genesisStore';
import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import MainLayout from '@/templates/MainLayout';
import { truncateMiddle } from '@/utils';

const DaoHome = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const fetchDaoFromDB = useGenesisStore((s) => s.fetchDaoFromDB);
  const fetchDao = useGenesisStore((s) => s.fetchDao);

  const currentDao = useGenesisStore((s) => s.currentDao);
  const isOwner =
    currentDao &&
    currentWalletAccount &&
    currentDao.daoOwnerAddress === currentWalletAccount.address;

  useEffect(() => {
    if (!daoId) {
      return;
    }
    fetchDaoFromDB(daoId as string);
    fetchDao(daoId as string);
  }, [daoId, fetchDaoFromDB, fetchDao]);

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
        />
      </div>
    );
  };

  return (
    <MainLayout
      title='GenesisDAO - DAO Platform On Polkadot'
      description='GenesisDAO Description'>
      <div className='mt-12 flex justify-center'>
        <div className='container mx-auto mt-5 flex min-w-[600px] max-w-[820px] justify-between px-12 py-5'>
          <div className='flex flex-col rounded-xl p-5'>
            <div className=''>{displayImage()}</div>
            <h1 className='mb-2 max-w-[300px] break-words text-center'>
              {currentDao?.daoName}
            </h1>
            <p className='mb-2'>
              <span className='font-bold'>DAO ID : </span> {currentDao?.daoId}
            </p>
            <p className='mb-2'>
              <span className='font-bold'>Setup Complete? </span>
              <span>{currentDao?.setupComplete ? 'Yes' : 'No'}</span>
            </p>
            <p className='mb-2'>
              <span className='font-bold'>Asset ID: </span>{' '}
              {currentDao?.daoAssetId
                ? currentDao?.daoAssetId
                : 'Tokens not issued yet'}{' '}
            </p>
            <p className='mb-2'>
              <span className='font-bold'>Asset Symbol: </span>{' '}
              {currentDao?.daoId}
            </p>
            <p className='mb-2'>
              <span className='font-bold'>DAO Owner: </span>{' '}
              {truncateMiddle(currentDao?.daoOwnerAddress)}
            </p>
            <div className='mb-2 max-w-[300px] break-words'>
              <p className='font-bold'>DAO Overview: </p>
              <p>{currentDao?.descriptionShort}</p>
            </div>
            <div className='mb-2 max-w-[300px] break-words'>
              <p className='font-bold'>DAO Details: </p>
              <p>{currentDao?.descriptionLong}</p>
            </div>
          </div>
          <div className='flex flex-col gap-y-3'>
            {currentDao?.setupComplete ||
            currentWalletAccount?.address !==
              currentDao?.daoOwnerAddress ? null : (
              <Link
                href={`/dao/${encodeURIComponent(daoId as string)}/customize`}
                className={`${!currentWalletAccount ? 'disable-link' : ''}`}>
                <button
                  className={`btn-primary btn w-[180px]`}
                  disabled={!currentWalletAccount}>
                  Customize DAO
                </button>
              </Link>
            )}
            <Link
              href={`/dao/${encodeURIComponent(daoId as string)}/tokens`}
              className={`${!currentWalletAccount ? 'disable-link' : ''}`}>
              <button
                className={`btn-primary btn w-[180px]`}
                disabled={!currentWalletAccount}>
                Manage Tokens
              </button>
            </Link>
            {currentDao && isOwner && (
              <DestroyDao
                daoId={currentDao?.daoId}
                assetId={currentDao.daoAssetId}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DaoHome;
