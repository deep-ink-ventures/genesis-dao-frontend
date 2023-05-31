import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import { BN } from '@polkadot/util';
import type { Wallet } from '@talismn/connect-wallets';
import { create } from 'zustand';

import { NODE_URL, SERVICE_URL } from '@/config';

// ALL TYPES and INTERFACES...

export interface FaultyReport {
  proposalId: string;
  reason: string;
}

export interface ProposalCreationValues {
  title: string;
  description: string;
  url: string;
}

export enum ProposalStatus {
  Active = 'Active',
  Counting = 'Counting',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Faulty = 'Faulty',
}

type ProposalStatusNames = {
  [key: string]: ProposalStatus;
};

const proposalStatusNames: ProposalStatusNames = {
  RUNNING: ProposalStatus.Active,
  PENDING: ProposalStatus.Counting,
  REJECTED: ProposalStatus.Rejected,
  IMPLEMENTED: ProposalStatus.Accepted,
  FAULTED: ProposalStatus.Faulty,
};

export interface ProposalOnChain {
  id: string;
  daoId: string;
  creator: string;
  birthBlock: number;
  meta: string;
  metaHash: string;
  status: ProposalStatus;
  inFavor: BN;
  against: BN;
}

export interface CreateProposalInfo {
  daoId: string;
  proposalId: string;
  meta: string;
  hash: string;
}

export interface IncomingProposal {
  id: string;
  dao_id: string;
  creator_id: string;
  status: string;
  fault: string | null;
  votes: {
    pro: number;
    contra: number;
    abstained: number;
    total: number;
  };
  metadata: null | {
    url: string | null;
    title: string | null;
    description: string | null;
  };
  metadata_url: null | string;
  metadata_hash: null | string;
  birth_block_number: number;
}

export interface ProposalDetail {
  proposalId: string;
  daoId: string;
  creator: string;
  birthBlock: number;
  metadataUrl: string | null;
  metadataHash: string | null;
  status: ProposalStatus | null;
  inFavor: BN;
  against: BN;
  proposalName: string | null;
  description: string | null;
  link: string | null;
}

export interface DaoDetail {
  daoId: string;
  daoName: string;
  daoOwnerAddress: string;
  daoCreatorAddress: string;
  setupComplete: boolean;
  daoAssetId: number | null;
  proposalDuration: number | null;
  proposalTokenDeposit: number;
  minimumMajority: number | null;
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
  daoAssetId: number;
  daoOwnerAddress: string;
  metadataUrl: string;
  metadataHash: string;
}

export interface CouncilMember {
  name: string;
  walletAddress: string;
}

export interface TokenRecipient {
  walletAddress: string;
  tokens: BN; // this is before adding DAO units
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
  tokensToIssue: BN; // fixme BN
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
  treasuryTokens: BN;
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

export type DaoPage = 'dashboard' | 'proposals';

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
  amount: BN;
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
  currentDao: DaoDetail | null;
  currentProposals: ProposalDetail[] | null;
  currentProposal: ProposalDetail | null;
  currentProposalFaultyReports: FaultyReport[] | null;
  currentBlockNumber: number | null;
  nativeTokenBalance: BN | null;
  daoTokenBalance: BN | null;
  currentDaoFromChain: BasicDaoInfo | null;
  daosFromDB: DaoDetail[] | null;
  walletAccounts: WalletAccount[] | undefined;
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
  inFavorVotes: BN;
  isFaultyModalOpen: boolean;
  isFaultyReportsOpen: boolean;
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
  fetchCurrentAssetId: () => void;
  fetchDaoFromDB: (daoId: string) => void;
  fetchBlockNumber: () => void;
  fetchDaoTokenBalanceFromDB: (assetId: number, accountId: string) => void;
  fetchProposalsFromDB: (daoId: string) => void;
  fetchOneProposalDB: (daoId: string, proposalId: string) => void;
  fetchProposalFaultyReports: (proposalId: string) => void;
  updateCurrentWalletAccount: (
    currentWalletAccount: WalletAccount | undefined
  ) => void;
  updateWalletAccounts: (walletAccounts: WalletAccount[] | undefined) => void;
  updateWalletConnected: (walletConnected: boolean) => void;
  updateCreateDaoData: (createDaoData: CreateDaoData) => void;
  updateRpcEndpoint: (rpcEndPoint: string) => void;
  updateDaos: (daos: AllDaos | null) => void;
  updateLoading: (loading: boolean) => void;
  updateTxnProcessing: (txnProcessing: boolean) => void;
  updateApiConnection: (apiConnection: any) => void;
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

const useGenesisStore = create<GenesisStore>()((set, get) => ({
  currentWalletAccount: undefined,
  currentProposal: null,
  walletAccounts: undefined,
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
  showCongrats: false,
  currentBlockNumber: null,
  proposalValues: null,
  daoPage: 'dashboard',
  currentProposals: null,
  inFavorVotes: new BN(0),
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

  // fetch all the daos and if wallet is connected then we will get the owned daos to daosOwnedByWallet
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
        proposalTokenDeposit: 0,
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
      daoDetail.proposalTokenDeposit = d.proposal_token_deposit;
      daoDetail.minimumMajority = d.minimum_majority_per_1024;
      daoDetail.metadataUrl = d.metadata_url;
      daoDetail.metadataHash = d.metadata_hash;
      daoDetail.setupComplete = d.setup_complete;

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
      const newDaos: DaoDetail[] = daosArr?.map((dao: any) => {
        return {
          daoId: dao.id,
          daoName: dao.name,
          daoAssetId: dao.asset_id,
          daoOwnerAddress: dao.owner_id,
          daoCreatorAddress: dao.creator_id,
          setupComplete: dao.setup_complete,
          metadataUrl: dao.metadata_url,
          metadataHash: dao.metadata_hash,
          email: dao.metadata?.email || null,
          descriptionShort: dao.metadata?.description_short || null,
          descriptionLong: dao.metadata?.description_long || null,
          images: {
            contentType: dao.metadata?.images.logo.content_type || null,
            small: dao.metadata?.images.logo.small.url || null,
            medium: dao.metadata?.images.logo.medium.url || null,
            large: dao.metadata?.images.logo.medium.url || null,
          },
        };
      });
      set({ daosFromDB: newDaos });
    } catch (err) {
      get().handleErrors(err);
    }
  },
  fetchDaoTokenBalance: (assetId: number, accountId: string) => {
    get()
      .apiConnection?.query?.assets?.account?.(assetId, accountId)
      .then((data) => {
        const assetData = data.toHuman() as unknown as IncomingTokenBalanceData;
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
      const newProposals = json.results.map((p: IncomingProposal) => {
        return {
          proposalId: p.id,
          daoId: p.dao_id,
          creator: p.creator_id,
          birthBlock: p.birth_block_number,
          metadataUrl: p.metadata_url || null,
          metadataHash: p.metadata_hash || null,
          status: proposalStatusNames[p.status as keyof ProposalStatusNames],
          inFavor: new BN(p.votes?.pro || 0),
          against: new BN(p.votes?.contra || 0),
          proposalName: p.metadata?.title || null,
          description: p.metadata?.description || null,
          link: p.metadata?.url || null,
        };
      });
      set({ currentProposals: newProposals });
      set({ currentBlockNumber: Number(response.headers.get('block-number')) });
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
        proposalName: p.metadata?.title || null,
        description: p.metadata?.description || null,
        link: p.metadata?.url || null,
      };
      set({ currentProposal: newProp });
      set({ currentBlockNumber: Number(response.headers.get('block-number')) });
      set({ inFavorVotes: new BN(p.votes?.pro || 0) });
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
  updateApiConnection: (apiConnection) => set(() => ({ apiConnection })),
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
  updateWalletConnected: (walletConnected) => set(() => ({ walletConnected })),
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
  updateDaoTokenBalance: (daoTokenBalance) => set(() => ({ daoTokenBalance })),
  updateNativeTokenBalance: (nativeTokenBalance) =>
    set(() => ({ nativeTokenBalance })),
  updateShowCongrats: (showCongrats) => set(() => ({ showCongrats })),
  updateCurrentProposal: (currentProposal) => set(() => ({ currentProposal })),
  updateBlockNumber: (currentBlockNumber) =>
    set(() => ({ currentBlockNumber })),
  updateProposalValues: (proposalValues) => set(() => ({ proposalValues })),
  updateDaoPage: (daoPage) => set(() => ({ daoPage })),
  updateIsFaultyModalOpen: (isFaultyModalOpen) =>
    set(() => ({ isFaultyModalOpen })),
  updateIsFaultyReportsOpen: (isFaultyReportsOpen) =>
    set({ isFaultyReportsOpen }),
}));

export default useGenesisStore;
