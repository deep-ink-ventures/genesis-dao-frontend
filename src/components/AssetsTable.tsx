import { BN } from '@polkadot/util';
import cn from 'classnames';
import Image from 'next/image';

import type { Asset, AssetHolding } from '@/services/assets';
import type { RawDao } from '@/services/daos';
import coinsTransfer from '@/svg/coinsTransfer.svg';
import openLink from '@/svg/openlink.svg';
import { uiTokens } from '@/utils';

import DaoImage from './DaoImage';

export type AssetHoldingsTableItem = AssetHolding & {
  asset?: Asset & { dao?: RawDao };
  isAdmin?: boolean;
};

interface AssestHoldingsTableProps {
  assetHoldings?: Array<AssetHoldingsTableItem>;
  onTransferClick?: (assetHolding?: AssetHoldingsTableItem) => void;
  onOpenLinkClick?: (assetHolding?: AssetHoldingsTableItem) => void;
}

const AssetItemRow = ({
  assetHolding,
  onTransferClick,
  onOpenLinkClick,
}: Omit<AssestHoldingsTableProps, 'assetHoldings'> & {
  assetHolding: AssetHoldingsTableItem;
}) => {
  return (
    <div
      className='grid grid-cols-[auto_10%_15%_15%_15%] gap-2 space-x-2 rounded-lg border-[0.3px] border-solid
    border-neutral-focus px-4 py-3 text-sm font-normal text-neutral-focus'>
      <span className='flex items-center gap-2'>
        <div className='relative flex items-center justify-center'>
          <DaoImage
            image={assetHolding?.asset?.dao?.metadata?.images?.logo?.small?.url}
            width={60}
            height={60}
          />
        </div>
        {assetHolding.asset?.dao?.name}
      </span>
      <span className='my-auto'>{assetHolding.asset?.dao?.id}</span>
      <span className='my-auto'>
        <span
          key={`${assetHolding.id}-${assetHolding.isAdmin}`}
          className={cn(
            'badge inline-block w-fit max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-xs text-base-100',
            {
              'badge-primary': assetHolding.isAdmin,
            }
          )}>
          {assetHolding.isAdmin ? 'Admin' : 'Token Holder'}
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
        <span
          className='rounded-full border border-solid border-neutral-focus p-2 hover:border-primary'
          onClick={() => onTransferClick && onTransferClick(assetHolding)}>
          <Image
            src={coinsTransfer}
            alt='transfer'
            width={16}
            height={16}
            className='m-auto cursor-pointer'
          />
        </span>
        <span
          className='rounded-full border border-solid border-neutral-focus p-2 hover:border-primary'
          onClick={() => onOpenLinkClick && onOpenLinkClick(assetHolding)}>
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
  );
};

const AssetsHoldingsTable = ({
  assetHoldings = [],
  onTransferClick,
  onOpenLinkClick,
}: AssestHoldingsTableProps) => {
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
          <AssetItemRow
            key={`${index}-${assetHolding.id}`}
            assetHolding={assetHolding}
            onTransferClick={onTransferClick}
            onOpenLinkClick={onOpenLinkClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AssetsHoldingsTable;
