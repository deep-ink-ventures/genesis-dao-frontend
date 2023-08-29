import type { BN } from '@polkadot/util';

export enum MultiSigTransactionStatus {
  Pending = 'PENDING',
  Cancelled = 'CANCELLED',
  Executed = 'EXECUTED',
}

export interface MultiSigTransaction {
  id: number;
  multisigAddress: string;
  daoId?: string | null;
  call?: {
    hash?: string | null;
    module?: string | null;
    function?: string | null;
    args?: Record<string, any> | null;
  } | null;
  callHash: string;
  correspondingModels?: {
    asset?: {
      id?: number | null;
      daoId?: string | null;
      ownerId?: string | null;
      totalSupply?: BN | null;
    } | null;
    dao?: {
      id?: string | null;
      name?: string | null;
      creatorId?: string | null;
      ownerId?: string | null;
      assetId?: number | null;
      proposalDuration?: number | null;
      proposalTokenDeposit?: BN | null;
      minimumMajorityPer1024?: number | null;
      setupComplete?: boolean | null;
      metadata?: Record<string, any> | null;
      metadataUrl?: string | null;
      metadataHash?: string | null;
      numberOfTokenHolders?: number | null;
      numberOfOpenProposals?: number | null;
      mostRecentProposals?: string | null;
    } | null;
    proposal?: {
      id?: number | null;
      daoId?: string | null;
      creatorId?: string | null;
      status?: string | null;
      fault?: string | null;
      votes?: {
        pro?: BN | null;
        contra?: BN | null;
        abstained?: BN | null;
        total?: BN | null;
      } | null;
      metadata?: Record<string, any> | null;
      metadataUrl?: string | null;
      metadataHash?: string | null;
      birthBlockNumber?: number | null;
      setupComplete?: boolean | null;
    } | null;
  };
  status: MultiSigTransactionStatus;
  threshold?: number | null;
  approvers?: string[] | null;
  lastApprover?: string | null;
  executedAt?: string | null;
  canceledBy?: string | null;
  createdAt: string;
  updatedAt: string;
}
