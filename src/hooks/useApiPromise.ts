import { ApiPromise, WsProvider } from '@polkadot/api';

import useGenesisStore from '@/stores/genesisStore';
// fixme not sure why it keeps disconnecting
const useApiPromise = () => {
  const rpcEndpoint = useGenesisStore((s) => s.rpcEndpoint);

  const create = async (): Promise<ApiPromise> => {
    const wsProvider = new WsProvider(rpcEndpoint);
    try {
      const api = await ApiPromise.create({ provider: wsProvider });
      await api.isReady;
      return api;
    } catch (err) {
      return err;
    }
  };

  return {
    apiPromise: create(),
  };
};

export default useApiPromise;
