import { BN } from '@polkadot/util';

import { SERVICE_URL } from '@/config';
import type { ProposalDetail, RawProposal } from '@/types/proposal';
import { proposalStatusNames } from '@/types/proposal';
import type { Paginated } from '@/types/response';
import { camelToSnakeCase } from '@/utils';

export interface ReportFaultedRequestPayload {
  proposalId: string;
  reason: string;
}

export interface ListProposalsQueryParams {
  search?: string;
  limit?: number;
  ordering?: string;
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
    ?.filter((p: RawProposal) => {
      return !!p.metadata_url === true;
    })
    .map((p: RawProposal) => {
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
    data: json as Paginated<RawProposal>,
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
