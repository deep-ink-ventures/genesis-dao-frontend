import type { BN } from '@polkadot/util';

import type { CouncilMember, TokenRecipient } from '@/types/council';

export interface DaoDetail {
  daoId: string;
  daoName: string;
  daoOwnerAddress: string;
  daoCreatorAddress: string;
  adminAddresses: string[];
  setupComplete: boolean;
  daoAssetId: number | null;
  proposalDuration: number | null;
  proposalTokenDeposit: BN | null;
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
  numberOfTokenHolders: number | null;
  numberOfOpenProposals: number | null;
  mostRecentProposals: string[] | null;
}

export interface BasicDaoInfo {
  daoId: string;
  daoName: string;
  daoAssetId: number;
  daoOwnerAddress: string;
  metadataUrl: string;
  metadataHash: string;
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
  tokensToIssue: number;
  tokensRecipients: TokenRecipient[] | null;
  treasuryTokens: number;
}

export interface RawDaoInfo {
  id: string;
  name: string;
  owner: string;
  assetId: number;
  meta: string;
  metaHash: string;
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
