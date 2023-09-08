import { BN } from '@polkadot/util';

import type { AssetHolding } from '@/services/assets';
import { MAX_BN_INIT_NUMBER } from '@/stores/genesisStore';
import { uiTokens } from '@/utils';

import DaoImage from './DaoImage';

const divisor = MAX_BN_INIT_NUMBER / 2;

const AssetHoldingCard = (props: {
  assetHolding: AssetHolding;
  daoImage?: string | null;
  daoId?: string;
}) => {
  const { assetHolding, daoImage, daoId } = props;

  const assetHoldingBalance =
    assetHolding.balance >= MAX_BN_INIT_NUMBER
      ? new BN(assetHolding.balance / divisor).mul(new BN(divisor))
      : new BN(assetHolding.balance);

  return (
    <div className='flex gap-2 rounded-lg border-[0.02rem] border-neutral-focus px-4 py-3'>
      <DaoImage image={daoImage || undefined} width={40} height={40} />
      <div>
        <div>{daoId}</div>
        <div>Owned Tokens: {uiTokens(assetHoldingBalance, 'dao', ' ')}</div>
      </div>
    </div>
  );
};

export default AssetHoldingCard;
