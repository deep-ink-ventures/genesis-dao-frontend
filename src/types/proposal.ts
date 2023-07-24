import type { BN } from '@polkadot/util';

export enum ProposalStatus {
  Active = 'Active',
  Counting = 'Counting',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Faulty = 'Faulty',
}

export type ProposalStatusNames = {
  [key: string]: ProposalStatus;
};

export interface ProposalCreationValues {
  title: string;
  description: string;
  url: string;
}

export const proposalStatusNames: ProposalStatusNames = {
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
  voterCount: BN;
  proposalName: string | null;
  description: string | null;
  link: string | null;
  metadata?: null | {
    url: string | null;
    title: string | null;
    description: string | null;
  };
  setupComplete: boolean;
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
  setup_complete: boolean;
}

export interface FaultyReport {
  proposalId: string;
  reason: string;
}
