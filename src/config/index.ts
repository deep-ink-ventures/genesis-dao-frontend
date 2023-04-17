export const NODE_URL: Readonly<string> =
  process.env.NODE_URL || 'wss://node.genesis-dao.org';

export const SERVICE_URL: Readonly<string> =
  process.env.SERVICE_URL || 'https://service.genesis-dao.org';

export const NATIVE_UNITS: Readonly<number> = 10000000000; // equals to one MUNIT
export const DAO_UNITS: Readonly<number> = 10000000000;
export const BLOCK_TIME: Readonly<number> = 6; // seconds
