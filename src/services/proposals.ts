import { BN } from '@polkadot/util';

import { SERVICE_URL } from '@/config';
import { camelToSnakeCase } from '@/utils';

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

export const proposalStatusNames: ProposalStatusNames = {
  RUNNING: ProposalStatus.Active,
  PENDING: ProposalStatus.Counting,
  REJECTED: ProposalStatus.Rejected,
  IMPLEMENTED: ProposalStatus.Accepted,
  FAULTED: ProposalStatus.Faulty,
};

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
}

export interface ReportFaultedRequestPayload {
  proposalId: string;
  reason: string;
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

interface ListProposalsQueryParams {
  daoId?: string;
  limit?: number;
  orderBy?: string;
}

const listProposals = async (params?: ListProposalsQueryParams) => {
  let queryEntries = Object.entries(params || {}).filter(([, v]) => v != null);

  queryEntries = queryEntries.map((value) => [
    camelToSnakeCase(value[0]),
    value[1],
  ]);

  const query = Object.fromEntries(queryEntries);

  const queryString = new URLSearchParams(query);

  const response = await fetch(
    `${SERVICE_URL}/proposals/?${queryString?.toString()}`
  );

  const json = await response.json();
  const newProposals: ProposalDetail[] = json.results
    ?.filter((p: IncomingProposal) => {
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
        status: proposalStatusNames[p.status],
        inFavor: new BN(p.votes?.pro || 0),
        against: new BN(p.votes?.contra || 0),
        voterCount: new BN(p.votes?.total || 0),
        proposalName: p.metadata?.title || null,
        description: p.metadata?.description || null,
        link: p.metadata?.url || null,
        metadata: p.metadata,
      };
    });

  return {
    response,
    mappedData: newProposals,
  };
};

const reportFaulted = async (
  id: string,
  payload: ReportFaultedRequestPayload
) => {
  const jsonData = JSON.stringify({
    proposal_id: payload.proposalId,
    reason: payload.reason,
  });
  const response = await fetch(
    `${SERVICE_URL}/proposals/${id}/report-faulted/`,
    {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
};

export const ProposalsService = {
  listProposals,
  reportFaulted,
};
