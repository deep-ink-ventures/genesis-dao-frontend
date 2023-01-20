// Import
import { ApiPromise, WsProvider } from '@polkadot/api';

// Construct
const wsProvider = new WsProvider('ws://127.0.0.1:9944');

const connect = async () => {
  const api = await ApiPromise.create({ provider: wsProvider });
  const ready = await api.isReady;
  if (ready) {
    console.log(api.genesisHash.toHex());
  }
};

connect();

// const hello = () => {
//   console.log('hello')
// }
// hello()

// export default hello
