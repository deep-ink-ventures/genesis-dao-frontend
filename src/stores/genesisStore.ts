import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import type { u128 } from '@polkadot/types';
import type { Wallet } from '@talismn/connect-wallets';
import { create } from 'zustand';

import { LOCAL_NODE } from './constants';

// ALL TYPES and INTERFACES

export interface IncomingDaoInfo {
  id: string;
  name: string;
  owner: string;
  assetId: string;
}

export interface CreateDaoData {
  daoId: string;
  daoName: string;
}

export interface IssueTokenData {
  daoId: string;
  supply: u128;
}

export interface WalletAccount {
  address: string;
  source: string;
  name?: string;
  wallet?: Wallet;
  signer: InjectedSigner;
}

export interface DaoInfo {
  assetId: string | null;
  daoId: string;
  daoName: string;
  owner: string;
}

export interface GenesisState {
  currentWalletAccount: WalletAccount | undefined;
  walletAccounts: WalletAccount[] | undefined;
  walletConnected: boolean;
  createDaoData: CreateDaoData | null;
  rpcEndpoint: string;
  daos: DaoInfo[] | null;
}

export interface GenesisActions {
  updateCurrentWalletAccount: (
    currentWalletAccount: WalletAccount | undefined
  ) => void;
  updateWalletAccounts: (walletAccounts: WalletAccount[] | undefined) => void;
  updateWalletConnected: (walletConnected: boolean) => void;
  updateCreateDaoData: (createDaoData: CreateDaoData) => void;
  updateRpcEndpoint: (rpcEndPoint: string) => void;
  updateDaos: (daos: DaoInfo[]) => void;
  fetchDaos: (rpcEndpoint: string) => void;
  addOneDao: (createDaoData: CreateDaoData) => void;
}

export interface GenesisStore extends GenesisState, GenesisActions {}

// STORE

const useGenesisStore = create<GenesisStore>()((set, get) => ({
  currentWalletAccount: undefined,
  walletAccounts: undefined,
  walletConnected: false,
  createDaoData: null,
  rpcEndpoint: LOCAL_NODE,
  daos: null,
  updateCurrentWalletAccount: (currentWalletAccount) =>
    set(() => ({ currentWalletAccount })),
  updateWalletAccounts: (walletAccounts) => set(() => ({ walletAccounts })),
  updateWalletConnected: (walletConnected) => set(() => ({ walletConnected })),
  updateCreateDaoData: (createDaoData) => set(() => ({ createDaoData })),
  updateRpcEndpoint: (rpcEndpoint) =>
    set(() => ({
      rpcEndpoint,
    })),
  updateDaos: (daos) => set(() => ({ daos })),

  addOneDao: (createDaoData: CreateDaoData) => {
    const currentDaos = get().daos;
    const address = get().currentWalletAccount?.address;
    if (currentDaos && address) {
      const newObj = {
        daoId: createDaoData.daoId,
        daoName: createDaoData.daoName,
        owner: address,
        assetId: null,
      };
      set({ daos: [...currentDaos, newObj] });
    }
  },

  fetchDaos: async (rpcEndpoint: string) => {
    ApiPromise.create({ provider: new WsProvider(rpcEndpoint) })
      .then((api) => {
        api?.query?.daoCore?.daos
          ?.entries()
          .then((daoEntries) => {
            const daos: DaoInfo[] = [];
            daoEntries.forEach(([_k, v]) => {
              const dao = v.toHuman() as unknown as IncomingDaoInfo;
              const newObj = {
                daoId: dao.id,
                daoName: dao.name,
                owner: dao.owner,
                assetId: dao.assetId,
              };
              daos.push(newObj);
            });
            set({ daos });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
}));

export default useGenesisStore;
