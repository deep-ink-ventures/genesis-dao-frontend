export const LOCAL_NODE: Readonly<string> =
  'wss://node.genesis-dao.org' ||
  process.env.LOCAL_NODE ||
  'ws://127.0.0.1:9944';
