export const NODE_URL: Readonly<string> =
  process.env.NODE_URL || 'ws://chain:9944';

export const SERVICE_URL: Readonly<string> =
  process.env.SERVICE_URL || 'http://app:8000';

export const NATIVE_UNITS: Readonly<number> = 10000000000; // same as polkadot 10 decimals
export const DAO_UNITS: Readonly<number> = 10000000000;
export const BLOCK_TIME: Readonly<number> = 6; // seconds
