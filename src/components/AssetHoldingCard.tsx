import { BN } from '@polkadot/util';

import type { Asset, AssetHolding } from '@/services/assets';
import type { Dao } from '@/services/daos';
import { uiTokens } from '@/utils';

import DaoImage from './DaoImage';

const AssetHoldingCard = (props: {
  assetHolding: AssetHolding & { asset?: Asset & { dao?: Dao } };
}) => {
  const { assetHolding } = props;
  return (
    <div className='flex gap-2 rounded-lg border-[0.02rem] border-neutral-focus px-4 py-3'>
      <DaoImage
        image={assetHolding?.asset?.dao?.metadata?.images?.logo?.small?.url}
        width={40}
        height={40}
      />
      <div>
        <div>{assetHolding?.asset?.dao_id}</div>
        <div>Owned Tokens: {uiTokens(new BN(assetHolding.balance), 'dao')}</div>
      </div>
    </div>
  );
};

export default AssetHoldingCard;
