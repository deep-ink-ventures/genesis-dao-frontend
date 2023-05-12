import { BN } from '@polkadot/util';

import {
  getMultisigAddress,
  hexToBase64,
  isValidPolkadotAddress,
  truncateMiddle,
  uiTokens,
} from '../src/utils';

describe('Utils', () => {
  test('Truncate works', () => {
    const string = 'abcdefgiiii';
    const truncatedString = truncateMiddle(string);
    expect(truncatedString).toBe('abcd...iiii');
  });

  describe('isValidPolkadotAddress can invalidate wrong address', () => {
    test('wrong address', () => {
      expect(isValidPolkadotAddress('not the right address')).toBeFalsy();
    });
  });

  describe('isValidPolkadotAddress can validate correct address', () => {
    test('correct address', () => {
      expect(
        isValidPolkadotAddress(
          '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6'
        )
      ).toBeTruthy();
    });
  });

  describe('getMultisigAddress can generate a correct multisig address', () => {
    const generatedAddress = getMultisigAddress(
      [
        '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
        '5GpGweMfmUe8rV5ScXJgfhEAVU3Aom4yVF2YH9pscNQGzZgw',
      ],
      2
    );

    const correctMultisig = '5HATgae7PKbgmN36M7wPF5UTtr8Vc7rQCnctRpQETut6jV2q';

    test('correct address', () => {
      expect(generatedAddress === correctMultisig).toBeTruthy();
    });
  });

  describe('hexToBase64 can transform a hex string to base 64 string', () => {
    const hexString = '3d89ee71a7e17d160a12bc0e04d8ee9e';
    const base64String = 'PYnucafhfRYKErwOBNjung==';

    test('correct address', () => {
      expect(hexToBase64(hexString) === base64String).toBeTruthy();
    });
  });

  describe('uiTokens should format tokens properly', () => {
    const raw = new BN(2000000000000);

    test('correct uiTokens output', () => {
      expect(uiTokens(raw, 'dao', 'MANGO') === '200 MANGO').toBeTruthy();
    });
  });
});
