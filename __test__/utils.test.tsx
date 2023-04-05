import {
  getMultisigAddress,
  isValidPolkadotAddress,
  truncateMiddle,
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
});
