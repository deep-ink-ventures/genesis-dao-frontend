export const NODE_URL: Readonly<string> =
  process.env.NODE_URL || 'wss://node.genesis-dao.org';

export const SERVICE_URL: Readonly<string> =
  process.env.SERVICE_URL || 'https://service.genesis-dao.org';

export const NATIVE_UNITS: Readonly<number> = 10000000000; // same as polkadot 10 decimals
export const DAO_UNITS: Readonly<number> = 10000000000;
export const BLOCK_TIME: Readonly<number> = 6; // seconds
export const VOTING_DURATION_UNITS: Readonly<number> = 50;  // 14400 blocks in a day 