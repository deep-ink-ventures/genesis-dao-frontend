import { BN } from '@polkadot/util';

import { SERVICE_URL } from '@/config';
import type {
  IncomingProposal,
  PostProposalMetadataResponse,
  ProposalCreationValues,
  ProposalDetail,
} from '@/types/proposal';
import { proposalStatusNames } from '@/types/proposal';
import type { Paginated } from '@/types/response';
import { camelToSnakeCase } from '@/utils';

export interface ReportFaultedRequestPayload {
  proposalId: string;
  reason: string;
}

export interface ReportFaultyResponse {
  reason?: {
    detail?: string;
  };
  detail?: string;
}

export interface ListProposalsQueryParams {
  daoId?: string;
  limit?: number;
  orderBy?: string;
  offset?: number;
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
        setupComplete: p.setup_complete,
      };
    });

  return {
    data: json as Paginated<IncomingProposal>,
    mappedData: newProposals,
  };
};

const postMetadata = async (
  proposalId: string,
  signature: string,
  metadata?: ProposalCreationValues
): Promise<
  Response & {
    data: PostProposalMetadataResponse;
  }
> => {
  const jsonData = JSON.stringify({
    title: metadata?.title,
    description: metadata?.description,
    url: metadata?.url,
  });
  const response = await fetch(
    `${SERVICE_URL}/proposals/${proposalId}/metadata/`,
    {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-Type': 'application/json',
        Signature: signature,
      },
    }
  );
  const objectMetadata = await response.json();

  return {
    ...response,
    data: objectMetadata,
  };
};

const reportFaultyProposal = async (
  proposalId: string,
  payload: ReportFaultedRequestPayload,
  signature?: string
): Promise<
  Response & {
    data: ReportFaultyResponse;
  }
> => {
  const jsonData = JSON.stringify({
    proposal_id: payload.proposalId,
    reason: payload.reason,
  });
  const response = await fetch(
    `${SERVICE_URL}/proposals/${proposalId}/report-faulted/`,
    {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-Type': 'application/json',
        ...(signature && {
          Signature: signature,
        }),
      },
    }
  );
  const objResponse = await response.json();
  return {
    ...response,
    data: objResponse,
  };
};

export const ProposalsService = {
  listProposals,
  reportFaultyProposal,
  postMetadata,
};
