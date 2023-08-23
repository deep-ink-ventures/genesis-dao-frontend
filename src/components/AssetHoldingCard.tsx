import { BN } from '@polkadot/util';

import type { AssetHolding } from '@/services/assets';
import { uiTokens } from '@/utils';

import DaoImage from './DaoImage';

const AssetHoldingCard = (props: {
  assetHolding: AssetHolding;
  daoImage?: string | null;
  daoId?: string;
}) => {
  const { assetHolding, daoImage, daoId } = props;
  return (
    <div className='flex gap-2 rounded-lg border-[0.02rem] border-neutral-focus px-4 py-3'>
      <DaoImage image={daoImage || undefined} width={40} height={40} />
      <div>
        <div>{daoId}</div>
        <div>
          Owned Tokens: {uiTokens(new BN(assetHolding.balance), 'dao', ' ')}
        </div>
      </div>
    </div>
  );
};

export default AssetHoldingCard;
