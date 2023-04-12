import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import type { Wallet } from '@talismn/connect-wallets';
import { create } from 'zustand';

import { LOCAL_NODE } from '@/config';

import placeholderValues from './placeholderValues';

// ALL TYPES and INTERFACES...

export interface DaoDetail {
  daoId: string;
  daoName: string;
  daoOwnerAddress: string;
  daoAssetId: number | null;
  metadataUrl: string | null;
  metadataHash: string | null;
  descriptionShort: string | null;
  descriptionLong: string | null;
  email: string | null;
  images: {
    contentType: string | null;
    small: string | null;
    medium: string | null;
    large: string | null;
  };
}

export interface BasicDaoInfo {
  daoId: string;
  daoName: string;
  daoOwnerAddress: string;
  metadataUrl: string;
  metadataHash: string;
  images: string | null;
}

export interface CouncilMember {
  name: string;
  walletAddress: string;
}

export interface TokenRecipient {
  walletAddress: string;
  tokens: number; // fixme BN
}

export interface CouncilTokensValues
  extends CouncilFormValues,
    IssueTokensValues {
  isFinished: false;
}

export interface LogoFormValues {
  email: string;
  shortOverview: string;
  longDescription: string;
  logoImage: FileList;
  imageString: string;
}

export interface MajorityModelValues {
  tokensToIssue: number; // fixme BN
  proposalTokensCost: number;
  minimumMajority: number; // percentage or decimals
  votingDays: number; // in days
}

export interface CouncilFormValues {
  creatorName: string;
  creatorWallet: string;
  councilMembers: CouncilMember[];
  councilThreshold: number; // number of councils needed to approve
}

export interface IssueTokensValues {
  tokenRecipients: TokenRecipient[];
  treasuryTokens: number;
}

export interface DaoCreationValues {
  daoId: string;
  daoName: string;
  email: string | null;
  daoLogo: string | null; // url?
  shortOverview: string | null;
  longDescription: string | null;
  proposalTokensCost: number;
  approvalThreshold: number; // percentage or decimals
  votingDays: number; // in days
  councilMembers: CouncilMember[];
  councilThreshold: number; // number of councils needed
  tokensToIssue: number; // fixme BN
  tokensRecipients: TokenRecipient[] | null;
  treasuryTokens: number; // fixme BN
}

export enum TxnResponse {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Warning = 'WARNING',
  Cancelled = 'CANCELLED',
}

export interface IncomingTokenBalanceData {
  balance: string;
  extra: string | null;
  reason: string;
  reserved: string; // number string
}

export interface AssetDetails {
  owner: string;
  issuer: string;
  admin: string;
  supply: string;
  deposit: string;
  minBalance: string;
  isSufficient: boolean;
  accounts: string;
  sufficients: string;
  approvals: string;
  status: string;
}

export interface TransferFormValues {
  assetId: number;
  toAddress: string;
  amount: number;
}

export interface TxnNotification {
  title: string;
  message: string;
  type: TxnResponse;
  timestamp: number;
  txnHash?: string;
}

export interface IncomingDaoInfo {
  id: string;
  name: string;
  owner: string;
  assetId: number;
  meta: string;
  metaHash: string;
}

export interface CreateDaoData {
  daoId: string;
  daoName: string;
}

export interface IssueTokensData {
  daoId: string;
  supply: number; // fixme change this to BN
}

export interface WalletAccount {
  address: string;
  source: string;
  name?: string;
  wallet?: Wallet;
  signer: InjectedSigner;
}

export interface DaoInfo {
  assetId: number | null;
  daoId: string;
  daoName: string;
  owner: string;
  metaUrl: string | null;
  metaHash: string | null;
  descriptionShort: string | null;
  descriptionLong: string | null;
  email: string | null;
  images: null | {
    logo: {
      contentType: string;
      small: string;
      medium: string;
      large: string;
    };
  };
}

export interface AllDaos {
  [daoId: string]: DaoInfo;
}

export interface GenesisState {
  currentWalletAccount: WalletAccount | undefined;
  currentAssetId: number | null;
  currentAssetBalance: number | null;
  currentDao: DaoDetail | null;
  walletAccounts: WalletAccount[] | undefined;
  walletConnected: boolean;
  createDaoData: CreateDaoData | null;
  rpcEndpoint: string;
  daos: AllDaos | null;
  daosOwnedByWallet: DaoInfo[] | null;
  txnNotifications: TxnNotification[];
  loading: boolean;
  txnProcessing: boolean;
  apiConnection: ApiPromise;
  createDaoSteps: number | null;
  newCreatedDao: DaoInfo | null;
  isStartModalOpen: boolean;
  daoCreationValues: DaoCreationValues;
  exploreDaos: BasicDaoInfo[] | null;
}

export interface GenesisActions {
  updateCurrentWalletAccount: (
    currentWalletAccount: WalletAccount | undefined
  ) => void;
  updateWalletAccounts: (walletAccounts: WalletAccount[] | undefined) => void;
  updateWalletConnected: (walletConnected: boolean) => void;
  updateCreateDaoData: (createDaoData: CreateDaoData) => void;
  updateRpcEndpoint: (rpcEndPoint: string) => void;
  updateDaos: (daos: AllDaos | null) => void;
  fetchDaos: () => void;
  fetchDaosFromDB: () => void;
  updateLoading: (loading: boolean) => void;
  addTxnNotification: (notification: TxnNotification) => void;
  removeTxnNotification: () => void;
  updateTxnProcessing: (txnProcessing: boolean) => void;
  updateApiConnection: (apiConnection: any) => void;
  createApiConnection: () => void;
  updateDaosOwnedByWallet: () => void;
  handleErrors: (err: Error | string) => void;
  updateCurrentAssetBalance: (currentAssetBalance: number) => void;
  fetchTokenBalance: (assetId: number, accountId: string) => void;
  updateCreateDaoSteps: (steps: number) => void;
  updateNewCreatedDao: (dao: DaoInfo) => void;
  updateIsStartModalOpen: (isStartModalOpen: boolean) => void;
  updateDaoCreationValues: (daoCreationValues: DaoCreationValues) => void;
  updateCurrentAssetId: (currentAssetId: number) => void;
  fetchCurrentAssetId: () => void;
  updateExploreDaos: (exploreDaos: BasicDaoInfo[]) => void;
  fetchDaoFromDB: (daoId: string) => void;
  updateCurrentDao: (currentDao: DaoDetail) => void;
  fetchDao: (daoId: string) => void;
}

export interface GenesisStore extends GenesisState, GenesisActions {}

// STORE...

const useGenesisStore = create<GenesisStore>()((set, get) => ({
  currentWalletAccount: undefined,
  walletAccounts: undefined,
  walletConnected: false,
  createDaoData: null,
  rpcEndpoint: LOCAL_NODE,
  daos: null,
  daosOwnedByWallet: null, // all the daos that can be managed by the wallet address
  txnNotifications: [],
  loading: false,
  txnProcessing: false,
  apiConnection: new ApiPromise({ provider: new WsProvider(LOCAL_NODE) }),
  currentAssetBalance: null,
  createDaoSteps: 1,
  newCreatedDao: null,
  isStartModalOpen: false,
  daoCreationValues: placeholderValues,
  currentAssetId: null,
  exploreDaos: null,
  currentDao: null,
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
  updateLoading: (loading) => set(() => ({ loading })),
  addTxnNotification: (newNotification) => {
    const oldTxnNotis = get().txnNotifications;
    // add the new noti to first index because we will start displaying notis from the last index
    const newNotis = [newNotification, ...oldTxnNotis];
    set({ txnNotifications: newNotis });
    // fixme don't use global scroll?
    // eslint-disable-next-line
    // window.scroll(0, 0);
    // $('html, body').animate({ scrollTop: 0 }, 'fast');
    // const isBrowser = () => typeof window !== 'undefined'; // The approach recommended by Next.js

    // const scrollToTop = () => {
    //   if (!isBrowser()) return;
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    // };
    // scrollToTop();
    // window.scrollTo(0, 0)
  },
  removeTxnNotification: () => {
    // first in first out
    const currentTxnNotis = get().txnNotifications;
    const newNotis = currentTxnNotis.slice(0, -1);
    set({ txnNotifications: newNotis });
  },

  // fetch all the daos and if wallet is connected then we will get the owned daos to daosOwnedByWallet
  fetchDaos: async () => {
    const apiCon = get().apiConnection;
    apiCon.query?.daoCore?.daos
      ?.entries()
      .then((daoEntries) => {
        const daos: AllDaos = {};
        // eslint-disable-next-line
        daoEntries.forEach(([_k, v]) => {
          const dao = v.toHuman() as unknown as IncomingDaoInfo;
          const newObj = {
            daoId: dao.id,
            daoName: dao.name,
            owner: dao.owner,
            assetId: dao.assetId,
            metaUrl: dao.meta,
            metaHash: dao.metaHash,
            descriptionShort: null,
            descriptionLong: null,
            email: null,
            images: null,
          };
          daos[dao.id] = newObj;
        });
        // this is the objs of daos
        set({ daos });

        // eslint-disable-next-line
        daoEntries.map(([_k, v]) => {
          const dao = v.toHuman() as unknown as IncomingDaoInfo;
          return {
            daoId: dao.id,
            daoName: dao.name,
            daoOwnerAddress: dao.owner,
            metadataUrl: dao.meta,
            metadataHash: dao.metaHash,
            images: null,
          };
        });

        // this is an array of daos
      })
      .catch((err) => {
        get().handleErrors(new Error(err));
      });
  },
  fetchDaosFromDB: async () => {
    try {
      const getDaosResponse = await fetch(
        'https://service.genesis-dao.org/daos/?order_by=id&limit=50'
      );
      const daosRes = await getDaosResponse.json();
      const daosArr = daosRes.results;
      const newDaos: BasicDaoInfo[] = daosArr?.map((dao: any) => {
        return {
          daoId: dao.id,
          daoName: dao.name,
          daoOwnerAddress: dao.owner_id,
          metadataUrl: dao.metadata_url,
          metadataHash: dao.metadata_hash,
          images: null,
        };
      });
      set({ exploreDaos: newDaos });
    } catch (err) {
      get().handleErrors(err);
    }
  },
  updateDaosOwnedByWallet: async () => {
    await get().fetchDaos();
    const { daos } = get();
    const address = get().currentWalletAccount?.address;
    if (!daos || typeof address === 'undefined') {
      return;
    }

    const daosArr = Object.values(daos);
    const daosByAddress = daosArr.filter((el) => {
      return el.owner === address;
    });

    set({ daosOwnedByWallet: daosByAddress });
  },
  updateTxnProcessing: (txnProcessing) => set(() => ({ txnProcessing })),
  updateApiConnection: (apiConnection) => set(() => ({ apiConnection })),
  createApiConnection: async () => {
    const { rpcEndpoint } = get();
    const createApi = async (): Promise<ApiPromise> => {
      const wsProvider = new WsProvider(rpcEndpoint);
      let api: any;
      try {
        api = await ApiPromise.create({ provider: wsProvider });
        await api.isReady;
        return api;
      } catch (err) {
        get().handleErrors(new Error(err));
        return err;
      }
    };
    set({ apiConnection: await createApi() });
  },

  updateCurrentAssetBalance: (currentAssetBalance) =>
    set(() => ({ currentAssetBalance })),

  fetchTokenBalance: (assetId: number, accountId: string) => {
    get()
      .apiConnection.query?.assets?.account?.(assetId, accountId)
      .then((data) => {
        const assetData = data.toHuman() as unknown as IncomingTokenBalanceData;
        if (assetData === null) {
          get().updateCurrentAssetBalance(0);
          return;
        }
        const balanceStr = assetData?.balance.replaceAll(',', '');
        get().updateCurrentAssetBalance(Number(balanceStr));
      })
      .catch((err) => {
        get().handleErrors(new Error(err));
      });
  },
  handleErrors: (err: Error | string) => {
    let message: string;
    if (typeof err === 'object') {
      message = err.message;
    } else {
      message = err;
    }

    const newNoti = {
      title: TxnResponse.Error,
      message,
      type: TxnResponse.Error,
      timestamp: Date.now(),
    };

    set({ txnProcessing: false });
    get().addTxnNotification(newNoti);
  },
  updateCreateDaoSteps: (createDaoSteps) => set(() => ({ createDaoSteps })),
  updateNewCreatedDao: (newCreatedDao) => set(() => ({ newCreatedDao })),
  updateIsStartModalOpen: (isStartModalOpen) =>
    set(() => ({ isStartModalOpen })),
  updateDaoCreationValues: (daoCreationValues) =>
    set(() => ({ daoCreationValues })),
  updateCurrentAssetId: (currentAssetId) =>
    set(() => ({
      currentAssetId,
    })),
  fetchCurrentAssetId: () => {
    get()
      .apiConnection.query.daoCore?.currentAssetId?.()
      .then((data) => {
        get().updateCurrentAssetId(Number(data.toHuman()));
      });
  },
  updateExploreDaos: (exploreDaos) => set(() => ({ exploreDaos })),
  updateCurrentDao: (currentDao) => set(() => ({ currentDao })),
  fetchDaoFromDB: async (daoId) => {
    try {
      const daoDetail = {
        daoId: '{N/A}',
        daoName: '',
        daoOwnerAddress: '',
        daoAssetId: null,
        metadataUrl: null,
        metadataHash: null,
        descriptionShort: null,
        descriptionLong: null,
        email: null,
        images: {
          contentType: null,
          small: null,
          medium: null,
          large: null,
        },
      };
      const response = await fetch(
        `https://service.genesis-dao.org/daos/${encodeURIComponent(
          daoId as string
        )}/`
      );
      if (response.status === 404) {
        return;
      }
      const d = await response.json();
      daoDetail.daoId = d.id;
      daoDetail.daoName = d.name;
      daoDetail.daoOwnerAddress = d.owner_id;
      daoDetail.daoAssetId = d.asset_id;
      daoDetail.metadataUrl = d.metadata_url;
      daoDetail.metadataHash = d.metadata_hash;

      if (d.metadata_url) {
        const jsonResponse = await fetch(d.metadata_url);
        const m = await jsonResponse.json();
        daoDetail.descriptionShort = m.description_short;
        daoDetail.descriptionLong = m.description_long;
        daoDetail.email = m.email;
        daoDetail.images.contentType = m.images.logo.content_type;
        daoDetail.images.small = m.images.logo.small.url;
        daoDetail.images.medium = m.images.logo.medium.url;
        daoDetail.images.large = m.images.logo.large.url;
      }

      get().updateCurrentDao(daoDetail);
    } catch (err) {
      get().handleErrors(err);
    }
  },
  fetchDao: () => {},
}));

export default useGenesisStore;
