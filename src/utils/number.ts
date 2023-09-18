import { BN } from '@polkadot/util';

export const MAX_BN_INIT_NUMBER = 0x20000000000000;

export const convertToBN = (value: number) => {
  if (value > MAX_BN_INIT_NUMBER) {
    const multiplier = Math.floor(value / MAX_BN_INIT_NUMBER);
    const remainder = value % MAX_BN_INIT_NUMBER;

    const multiplierBN = new BN(multiplier);
    const remainderBN = new BN(remainder);

    const valueBN = multiplierBN.muln(MAX_BN_INIT_NUMBER).add(remainderBN);

    return valueBN;
  }

  return new BN(value);
};
