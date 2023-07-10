import { BN } from '@polkadot/util';
import cn from 'classnames';
import Image from 'next/image';

import type { Asset, AssetHolding } from '@/services/assets';
import type { Dao } from '@/services/daos';
import coinsTransfer from '@/svg/coinsTransfer.svg';
import mountain from '@/svg/mountain.svg';
import openLink from '@/svg/openlink.svg';
import placeholderImage from '@/svg/placeholderImage.svg';
import { uiTokens } from '@/utils';

import Pagination from './Pagination';

const AssetsHoldingsTable = ({
  assetHoldings = [],
  currentWallet,
}: {
  assetHoldings?: Array<AssetHolding & { asset?: Asset & { dao?: Dao } }>;
  currentWallet?: string;
}) => {
  const displayImage = (image?: string, alt?: string) => {
    if (!image) {
      return (
        <>
          <Image
            src={placeholderImage}
            alt='placeholder'
            height={60}
            width={60}
          />
          <div className='absolute'>
            <Image src={mountain} alt='mountain' width={30} height={17}></Image>
          </div>
        </>
      );
    }
    return (
      <>
        <img
          src={image}
          alt={`${alt} logo image`}
          height={60}
          width={60}
          className='rounded-full'
        />
      </>
    );
  };

  return (
    <div className='w-full'>
      <div className='grid grid-cols-[auto_10%_15%_15%_15%] gap-2 space-x-2 px-4 py-3 text-sm font-normal text-neutral-focus'>
        <span>DAO NAME</span>
        <span>DAO ID</span>
        <span>Role</span>
        <span>Owned Tokens</span>
        <span>Actions</span>
      </div>
      <div className='space-y-2'>
        {assetHoldings.map((assetHolding, index) => (
          <div
            key={index}
            className='grid grid-cols-[auto_10%_15%_15%_15%] gap-2 space-x-2 rounded-lg border-[0.3px] border-solid
              border-neutral-focus px-4 py-3 text-sm font-normal text-neutral-focus
              '>
            <span className='flex items-center gap-2'>
              <div className='relative flex items-center justify-center'>
                {displayImage(
                  assetHolding?.asset?.dao?.metadata?.images?.logo?.small?.url
                )}
              </div>
              {assetHolding.asset?.dao?.name}
            </span>
            <span className='my-auto'>{assetHolding.asset?.dao?.id}</span>
            <span className='my-auto'>
              <span
                className={cn(
                  'badge inline-block w-fit max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-xs text-base-100',
                  {
                    'badge-primary':
                      assetHolding.owner_id.toLowerCase().trim() ===
                      currentWallet?.toLowerCase().trim(),
                  }
                )}>
                {assetHolding.owner_id.toLowerCase().trim() ===
                currentWallet?.toLowerCase().trim()
                  ? 'Admin'
                  : 'Token Holder'}
              </span>
            </span>
            <span className='my-auto'>
              {uiTokens(
                new BN(assetHolding.balance),
                'dao',
                `${assetHolding.asset?.dao?.id}`
              )}
            </span>
            <span className='my-auto flex gap-2'>
              <span className='rounded-full border border-solid border-neutral-focus p-2'>
                <Image
                  src={coinsTransfer}
                  alt='transfer'
                  width={16}
                  height={16}
                  className='m-auto cursor-pointer'
                />
              </span>
              <span className='rounded-full border border-solid border-neutral-focus p-2'>
                <Image
                  src={openLink}
                  alt='open link'
                  width={16}
                  height={16}
                  className='m-auto cursor-pointer'
                />
              </span>
            </span>
          </div>
        ))}
        <div>
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default AssetsHoldingsTable;
