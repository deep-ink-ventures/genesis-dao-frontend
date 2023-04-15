export const LOCAL_NODE: Readonly<string> =
  'wss://node.genesis-dao.org' ||
  process.env.LOCAL_NODE ||
  'ws://127.0.0.1:9944';

export const NATIVE_UNITS: Readonly<number> = 10000000000; // equals to one MUNIT
export const DAO_UNITS: Readonly<number> = 10000000000;
export const BLOCK_TIME: Readonly<number> = 6; // seconds
