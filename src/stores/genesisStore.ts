/* eslint-disable no-param-reassign */
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import { BN } from '@polkadot/util';
import type { Wallet } from '@talismn/connect-wallets';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { NODE_URL, SERVICE_URL } from '@/config';
import type {
  BasicDaoInfo,
  DaoCreationValues,
  DaoDetail,
  DaoInfo,
  IncomingDaoInfo,
} from '@/types/dao';
import type {
  FaultyReport,
  IncomingProposal,
  ProposalCreationValues,
  ProposalDetail,
  ProposalStatusNames,
} from '@/types/proposal';
import { proposalStatusNames } from '@/types/proposal';
import { TxnResponse } from '@/types/response';
import type { IncomingTokenBalanceData } from '@/types/token';
import { transformDaoToDaoDetail } from '@/utils/transformer';

import type { AccountSlice } from './account';
import { createAccountSlice } from './account';
import type { DaoSlice } from './dao';
import { createDaoSlice } from './dao';

export interface LogoFormValues {
  email: string;
  shortOverview: string;
  longDescription: string;
  logoImage: FileList;
  imageString: string;
}

export interface MajorityModelValues {
  tokensToIssue: BN;
  proposalTokensCost: number;
  minimumMajority: number; // percentage or decimals
  votingDays: number; // in days
}

export type DaoPage = 'dashboard' | 'proposals' | 'transactions' | 'governance';

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
export interface CreateDaoData {
  daoId: string;
  daoName: string;
}

export interface WalletAccount {
  address: string;
  source: string;
  name?: string;
  wallet?: Wallet;
  signer: InjectedSigner;
}

export interface AllDaos {
  [daoId: string]: DaoInfo;
}

export interface GenesisState {
  currentWalletAccount: WalletAccount | null;
  currentAssetId: number | null;
  currentDao: DaoDetail | null;
  currentProposals: ProposalDetail[] | null;
  currentProposal: ProposalDetail | null;
  currentProposalFaultyReports: FaultyReport[] | null;
  currentBlockNumber: number | null;
  nativeTokenBalance: BN | null;
  daoTokenBalance: BN | null;
  daoTokenSupplyBalance: BN | null;
  currentDaoFromChain: BasicDaoInfo | null;
  daosFromDB: DaoDetail[] | null;
  walletAccounts: WalletAccount[] | null;
  walletConnected: boolean;
  createDaoData: CreateDaoData | null;
  rpcEndpoint: string;
  daos: AllDaos | null;
  daosOwnedByWallet: DaoInfo[] | null;
  txnNotifications: TxnNotification[];
  loading: boolean;
  txnProcessing: boolean;
  apiConnection: ApiPromise | null;
  createDaoSteps: number | null;
  newCreatedDao: DaoInfo | null;
  isStartModalOpen: boolean;
  daoCreationValues: DaoCreationValues | null;
  showCongrats: boolean;
  proposalValues: ProposalCreationValues | null;
  daoPage: DaoPage;
  isFaultyModalOpen: boolean;
  isFaultyReportsOpen: boolean;
  pages: PageSlices;
}

interface PageSlices {
  dao: DaoSlice;
  account: AccountSlice;
}
export interface GenesisActions {
  createApiConnection: () => void;
  handleErrors: (err: Error | string) => void;
  removeTxnNotification: () => void;
  addTxnNotification: (notification: TxnNotification) => void;
  fetchDaos: () => void;
  fetchDaosFromDB: () => void;
  fetchDao: (daoId: string) => void;
  fetchDaoTokenBalance: (assetId: number, accountId: string) => void;
  fetchNativeTokenBalance: (address: string) => void;
  fetchDaoTokenSupplyBalance: (assetId: number) => void;
  fetchCurrentAssetId: () => void;
  fetchDaoFromDB: (daoId: string) => void;
  fetchBlockNumber: () => void;
  fetchDaoTokenBalanceFromDB: (assetId: number, accountId: string) => void;
  fetchProposalsFromDB: (daoId: string) => void;
  fetchOneProposalDB: (daoId: string, proposalId: string) => void;
  fetchProposalFaultyReports: (proposalId: string) => void;
  updateCurrentWalletAccount: (
    currentWalletAccount: WalletAccount | null
  ) => void;
  updateWalletAccounts: (walletAccounts: WalletAccount[] | null) => void;
  updateWalletConnected: (walletConnected: boolean) => void;
  updateCreateDaoData: (createDaoData: CreateDaoData) => void;
  updateRpcEndpoint: (rpcEndPoint: string) => void;
  updateDaos: (daos: AllDaos | null) => void;
  updateLoading: (loading: boolean) => void;
  updateTxnProcessing: (txnProcessing: boolean) => void;
  updateDaosOwnedByWallet: () => void;
  updateCreateDaoSteps: (steps: number) => void;
  updateNewCreatedDao: (dao: DaoInfo) => void;
  updateIsStartModalOpen: (isStartModalOpen: boolean) => void;
  updateDaoCreationValues: (daoCreationValues: DaoCreationValues) => void;
  updateCurrentAssetId: (currentAssetId: number) => void;
  updateDaosFromDB: (daosFromDB: DaoDetail[] | null) => void;
  updateCurrentDao: (currentDao: DaoDetail | null) => void;
  updateCurrentDaoFromChain: (currentDaoFromChain: BasicDaoInfo | null) => void;
  updateDaoTokenBalance: (daoTokenBalance: BN | null) => void;
  updateDaoTokenSupplyBalance: (daoTokenSupplyBalance: BN | null) => void;
  updateNativeTokenBalance: (nativeTokenBalance: BN | null) => void;
  updateShowCongrats: (showCongrats: boolean) => void;

  updateCurrentProposal: (proposal: ProposalDetail) => void;
  updateBlockNumber: (currentBlockNumber: number) => void;
  updateProposalValues: (proposalValues: ProposalCreationValues | null) => void;
  updateDaoPage: (daoPage: DaoPage) => void;
  updateIsFaultyModalOpen: (isFaultyModalOpen: boolean) => void;
  updateIsFaultyReportsOpen: (isFaultyReportsOpen: boolean) => void;
}

export interface GenesisStore extends GenesisState, GenesisActions {}

// STORE...

const useGenesisStore = create<GenesisStore>()(
  devtools((set, get, store) => ({
    currentWalletAccount: null,
    currentProposal: null,
    walletAccounts: null,
    walletConnected: false,
    createDaoData: null,
    rpcEndpoint: NODE_URL,
    daos: null,
    daosOwnedByWallet: null, // all the daos that can be managed by the wallet address
    txnNotifications: [],
    loading: false,
    txnProcessing: false,
    apiConnection: null,
    currentAssetBalance: null,
    createDaoSteps: 1,
    newCreatedDao: null,
    isStartModalOpen: false,
    daoCreationValues: null,
    currentAssetId: null,
    daosFromDB: null,
    currentDao: null,
    currentDaoFromChain: null,
    nativeTokenBalance: null,
    daoTokenBalance: null,
    daoTokenSupplyBalance: null,
    showCongrats: false,
    currentBlockNumber: null,
    proposalValues: null,
    daoPage: 'dashboard',
    currentProposals: null,
    isFaultyModalOpen: false,
    currentProposalFaultyReports: null,
    isFaultyReportsOpen: false,
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
      // eslint-disable-next-line
      // console.error(err)
      set({ txnProcessing: false });
      get().addTxnNotification(newNoti);
    },
    addTxnNotification: (newNotification) => {
      const oldTxnNotis = get().txnNotifications;
      // add the new noti to first index because we will start displaying notis from the last index
      const newNotis = [newNotification, ...oldTxnNotis];
      set({ txnNotifications: newNotis });
    },
    removeTxnNotification: () => {
      // first in first out
      const currentTxnNotis = get().txnNotifications;
      const newNotis = currentTxnNotis.slice(0, -1);
      set({ txnNotifications: newNotis });
    },
    fetchBlockNumber: () => {
      const apiCon = get().apiConnection;
      apiCon?.query?.system
        ?.number?.()
        .then((data) => {
          const blockNumber = Number(data);
          set({ currentBlockNumber: blockNumber });
        })
        .catch((err) => {
          get().handleErrors(err);
        });
    },

    fetchDaos: () => {
      const apiCon = get().apiConnection;
      apiCon?.query?.daoCore?.daos
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
            };
          });
        })
        .catch((err) => {
          get().handleErrors(new Error(err));
        });
    },
    fetchDao: (daoId) => {
      const apiCon = get().apiConnection;
      apiCon?.query?.daoCore
        ?.daos?.(daoId)
        .then((data) => {
          const d = data.toHuman() as unknown as IncomingDaoInfo;
          const dao = {
            daoId: d.id,
            daoName: d.name,
            daoOwnerAddress: d.owner,
            daoAssetId: d.assetId,
            metadataUrl: d.meta,
            metadataHash: d.metaHash,
          };
          get().updateCurrentDaoFromChain(dao);
        })
        .catch((err) => {
          get().handleErrors(err);
        });
    },
    fetchDaoFromDB: async (daoId) => {
      try {
        const daoDetail: DaoDetail = {
          daoId: '{N/A}',
          daoName: '{N/A}',
          daoOwnerAddress: '{N/A}',
          daoCreatorAddress: '{N/A}',
          setupComplete: false,
          proposalDuration: null,
          proposalTokenDeposit: null,
          minimumMajority: null,
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
          numberOfTokenHolders: null,
          numberOfOpenProposals: null,
          mostRecentProposals: null,
        };
        const response = await fetch(
          `${SERVICE_URL}/daos/${encodeURIComponent(daoId as string)}/`
        );
        if (response.status === 404) {
          return;
        }
        const d = await response.json();
        daoDetail.daoId = d.id;
        daoDetail.daoName = d.name;
        daoDetail.daoAssetId = d.asset_id;
        daoDetail.daoOwnerAddress = d.owner_id;
        daoDetail.daoCreatorAddress = d.creator_id;
        daoDetail.proposalDuration = d.proposal_duration;
        daoDetail.proposalTokenDeposit = d.proposal_token_deposit
          ? new BN(d.proposal_token_deposit)
          : null;
        daoDetail.minimumMajority = d.minimum_majority_per_1024;
        daoDetail.metadataUrl = d.metadata_url;
        daoDetail.metadataHash = d.metadata_hash;
        daoDetail.setupComplete = d.setup_complete;
        daoDetail.numberOfTokenHolders = d.number_of_token_holders;
        daoDetail.numberOfOpenProposals = d.number_of_open_proposals;
        daoDetail.mostRecentProposals = d.most_recent_proposals;

        if (d.metadata) {
          daoDetail.descriptionShort = d.metadata.description_short;
          daoDetail.descriptionLong = d.metadata.description_long;
          daoDetail.email = d.metadata.email;
          daoDetail.images.contentType = d.metadata.images.logo.content_type;
          daoDetail.images.small = d.metadata.images.logo.small.url;
          daoDetail.images.medium = d.metadata.images.logo.medium.url;
          daoDetail.images.large = d.metadata.images.logo.large.url;
        }

        get().updateCurrentDao(daoDetail);
      } catch (err) {
        get().handleErrors(err);
      }
    },
    fetchDaosFromDB: async () => {
      try {
        const getDaosResponse = await fetch(
          `${SERVICE_URL}/daos/?order_by=id&limit=50`
        );
        const daosRes = await getDaosResponse.json();
        const daosArr = daosRes.results;
        const newDaos: DaoDetail[] = daosArr?.map((dao: any) =>
          transformDaoToDaoDetail(dao)
        );
        set({ daosFromDB: newDaos });
      } catch (err) {
        get().handleErrors(err);
      }
    },
    fetchDaoTokenBalance: (assetId: number, accountId: string) => {
      get()
        .apiConnection?.query?.assets?.account?.(assetId, accountId)
        .then((data) => {
          const assetData =
            data.toHuman() as unknown as IncomingTokenBalanceData;
          if (assetData === null) {
            get().updateDaoTokenBalance(new BN(0));
            return;
          }
          const balanceStr = assetData?.balance?.replaceAll(',', '');
          const daoTokenBalance = new BN(balanceStr);
          set({ daoTokenBalance });
        })
        .catch((err) => {
          get().handleErrors(new Error(err));
        });
    },
    fetchDaoTokenBalanceFromDB: async (assetId: number, accountId: string) => {
      try {
        const response = await fetch(
          `${SERVICE_URL}/asset-holdings/?asset_id=${assetId}&owner_id=${accountId}`
        );
        const daoAsset = await response.json();
        const daoTokenBalance = new BN(daoAsset?.results[0]?.balance || 0);
        set({ daoTokenBalance });
      } catch (err) {
        get().handleErrors(err);
      }
    },
    fetchDaoTokenSupplyBalance: (assetId: number) => {
      get()
        .apiConnection?.query.assets?.asset?.(assetId)
        .then((data) => {
          const supply = (data.toHuman() as any)?.supply;
          if (supply?.length) {
            const daoTokenSupplyBalance = new BN(
              Number(supply?.replace(/,/g, ''))
            );
            set({ daoTokenSupplyBalance });
          }
        });
    },
    fetchNativeTokenBalance: async (address: string) => {
      try {
        const response = await fetch(`${SERVICE_URL}/accounts/${address}/`);
        if (response.status === 404) {
          return;
        }
        const account = await response.json();
        if (account.balance?.free) {
          const freeBalance = new BN(account.balance.free);
          set({ nativeTokenBalance: freeBalance });
        } else {
          set({ nativeTokenBalance: new BN(0) });
        }
      } catch (err) {
        get().handleErrors(err);
      }
    },
    fetchCurrentAssetId: () => {
      get()
        .apiConnection?.query.daoCore?.currentAssetId?.()
        .then((data) => {
          get().updateCurrentAssetId(Number(data.toHuman()));
        });
    },

    fetchProposalsFromDB: async (daoId) => {
      try {
        const response = await fetch(
          `${SERVICE_URL}/proposals/?dao_id=${daoId}&limit=50`
        );
        const json = await response.json();
        const newProposals = json.results
          .filter((p: IncomingProposal) => {
            // filter out proposals without offchain metadata
            return !!p.metadata_url === true;
          })
          .map((p: IncomingProposal) => {
            return {
              proposalId: p.id,
              daoId: p.dao_id,
              creator: p.creator_id,
              birthBlock: p.birth_block_number,
              metadataUrl: p.metadata_url || null,
              metadataHash: p.metadata_hash || null,
              status:
                proposalStatusNames[p.status as keyof ProposalStatusNames],
              inFavor: new BN(p.votes?.pro || 0),
              against: new BN(p.votes?.contra || 0),
              proposalName: p.metadata?.title || null,
              description: p.metadata?.description || null,
              link: p.metadata?.url || null,
              setupComplete: p.setup_complete,
            };
          });

        set({ currentProposals: newProposals });
        set({
          currentBlockNumber: Number(response.headers.get('block-number')),
        });
      } catch (err) {
        get().handleErrors(err);
      }
    },
    fetchOneProposalDB: async (daoId, proposalId) => {
      try {
        const response = await fetch(
          `${SERVICE_URL}/proposals/?dao_id=${daoId}&id=${proposalId}`
        );

        const { results } = await response.json();
        if (!results) {
          return;
        }
        const p: IncomingProposal = results?.[0];
        const newProp = {
          proposalId: p.id,
          daoId: p.dao_id,
          creator: p.creator_id,
          birthBlock: p.birth_block_number,
          metadataUrl: p.metadata_url || null,
          metadataHash: p.metadata_hash || null,
          status:
            proposalStatusNames[p.status as keyof ProposalStatusNames] || null,
          inFavor: new BN(p.votes?.pro || 0),
          against: new BN(p.votes?.contra || 0),
          voterCount: new BN(p.votes?.total || 0),
          proposalName: p.metadata?.title || null,
          description: p.metadata?.description || null,
          link: p.metadata?.url || null,
          setupComplete: p.setup_complete,
        };
        set({ currentProposal: newProp });
        set({
          currentBlockNumber: Number(response.headers.get('block-number')),
        });
      } catch (err) {
        get().handleErrors(err);
      }
    },
    fetchProposalFaultyReports: async (proposalId) => {
      try {
        const response = await fetch(
          `${SERVICE_URL}/proposals/${proposalId}/reports/`
        );

        const reportsRes = await response.json();

        if (!reportsRes || reportsRes.length < 1) {
          return;
        }

        const reports = reportsRes?.map(
          (item: { proposal_id: string; reason: string }) => {
            return {
              proposalId: item.proposal_id,
              reason: item.reason,
            };
          }
        );

        set({ currentProposalFaultyReports: reports });
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

    updateDaosFromDB: (daosFromDB) => set(() => ({ daosFromDB })),
    updateCurrentWalletAccount: (currentWalletAccount) =>
      set(() => ({ currentWalletAccount })),
    updateWalletAccounts: (walletAccounts) => set(() => ({ walletAccounts })),
    updateWalletConnected: (walletConnected) =>
      set(() => ({ walletConnected })),
    updateCreateDaoData: (createDaoData) => set(() => ({ createDaoData })),
    updateRpcEndpoint: (rpcEndpoint) =>
      set(() => ({
        rpcEndpoint,
      })),
    updateDaos: (daos) => set(() => ({ daos })),
    updateLoading: (loading) => set(() => ({ loading })),
    updateCurrentDao: (currentDao) => set(() => ({ currentDao })),
    updateCurrentDaoFromChain: (currentDaoFromChain) =>
      set(() => ({ currentDaoFromChain })),
    updateDaoTokenBalance: (daoTokenBalance) =>
      set(() => ({ daoTokenBalance })),
    updateDaoTokenSupplyBalance: (daoTokenSupplyBalance) =>
      set(() => ({ daoTokenSupplyBalance })),
    updateNativeTokenBalance: (nativeTokenBalance) =>
      set(() => ({ nativeTokenBalance })),
    updateShowCongrats: (showCongrats) => set(() => ({ showCongrats })),
    updateCurrentProposal: (currentProposal) =>
      set(() => ({ currentProposal })),
    updateBlockNumber: (currentBlockNumber) =>
      set(() => ({ currentBlockNumber })),
    updateProposalValues: (proposalValues) => set(() => ({ proposalValues })),
    updateDaoPage: (daoPage) => set(() => ({ daoPage })),
    updateIsFaultyModalOpen: (isFaultyModalOpen) =>
      set(() => ({ isFaultyModalOpen })),
    updateIsFaultyReportsOpen: (isFaultyReportsOpen) =>
      set({ isFaultyReportsOpen }),
    pages: {
      ...createDaoSlice(set, get, store),
      ...createAccountSlice(set, get, store),
    },
  }))
);

export default useGenesisStore;
