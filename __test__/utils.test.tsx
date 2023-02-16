import { isValidPolkadotAddress, truncateMiddle } from '../src/utils';

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
});
