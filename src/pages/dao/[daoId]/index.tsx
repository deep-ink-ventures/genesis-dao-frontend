import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import DestroyDao from '@/components/DestroyDao';
import type { DaoDetail } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import mountain from '@/svg/mountain.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import MainLayout from '@/templates/MainLayout';
import { truncateMiddle } from '@/utils';

const DaoHome = () => {
  const router = useRouter();
  const { daoId } = router.query;
  const [currentDao, setCurrentDao] = useState<DaoDetail | null>({
    daoId: '{N/A}',
    daoName: '{N/A}',
    daoOwnerAddress: '{N/A}',
    daoAssetId: null,
    metadataUrl: '{N/A}',
    metadataHash: '{N/A}',
    descriptionShort: '{N/A}',
    descriptionLong: '{N/A}',
    email: '{N/A}',
    images: {
      contentType: null,
      small: null,
      medium: null,
      large: null,
    },
  });
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const handleErrors = useGenesisStore((s) => s.handleErrors);
  const daos = useGenesisStore((s) => s.daos);
  const dao = daos?.[daoId as string];
  const isOwner =
    dao && currentWalletAccount && dao.owner === currentWalletAccount.address;

  useEffect(() => {
    if (!daoId) {
      return;
    }

    (async () => {
      try {
        const daoDetail = {
          daoId: '{N/A}',
          daoName: '',
          daoOwnerAddress: '',
          daoAssetId: null,
          metadataUrl: null,
          metadataHash: null,
          descriptionShort: null,
          descriptionLong: null,
          email: null,
          images: {
            contentType: null,
            small: null,
            medium: null,
            large: null,
          },
        };
        const response = await fetch(
          `https://service.genesis-dao.org/daos/${encodeURIComponent(
            daoId as string
          )}/`
        );
        const d = await response.json();
        daoDetail.daoId = d.id;
        daoDetail.daoName = d.name;
        daoDetail.daoOwnerAddress = d.owner_id;
        daoDetail.daoAssetId = d.asset_id;
        daoDetail.metadataUrl = d.metadata_url;
        daoDetail.metadataHash = d.metadata_hash;

        if (d.metadata_url) {
          const jsonResponse = await fetch(d.metadata_url);
          const m = await jsonResponse.json();
          daoDetail.descriptionShort = m.description_short;
          daoDetail.descriptionLong = m.description_long;
          daoDetail.email = m.email;
          daoDetail.images.contentType = m.images.logo.content_type;
          daoDetail.images.small = m.images.logo.small.url;
          daoDetail.images.medium = m.images.logo.medium.url;
          daoDetail.images.large = m.images.logo.large.url;
        }

        setCurrentDao(daoDetail);
      } catch (err) {
        handleErrors(err);
      }
    })();
  }, [daoId, handleErrors]);

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
          alt='placeholder'
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
            <h1 className='mb-2 text-center'>{currentDao?.daoName}</h1>
            <p className='mb-2'>
              <span className='font-bold'>DAO ID : </span> {currentDao?.daoId}
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
            <p className='mb-2'>
              <span className='font-bold'>DAO Overview: </span>
              <span>{currentDao?.descriptionShort}</span>
            </p>
            <p className='mb-2'>
              <span className='font-bold'>DAO Details: </span>
              <span>{currentDao?.descriptionLong}</span>
            </p>
          </div>
          <div className='flex flex-col gap-y-3'>
            <Link
              href={`/dao/${encodeURIComponent(daoId as string)}/customize`}
              className={`${!currentWalletAccount ? 'disable-link' : ''}`}>
              <button
                className={`btn-primary btn w-[180px]`}
                disabled={!currentWalletAccount}>
                Customize DAO
              </button>
            </Link>
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
              <DestroyDao daoId={currentDao?.daoId} assetId={dao?.assetId} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DaoHome;
