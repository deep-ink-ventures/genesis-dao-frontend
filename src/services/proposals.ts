import { BN } from '@polkadot/util';

import { SERVICE_URL } from '@/config';
import type { IncomingProposal, ProposalDetail } from '@/stores/genesisStore';
import { proposalStatusNames } from '@/stores/genesisStore';

const listProposals = async ({
  daoId,
  limit = 50,
  orderBy,
}: {
  daoId: string;
  limit?: number;
  orderBy?: string;
}) => {
  const response = await fetch(
    `${SERVICE_URL}/proposals/?dao_id=${daoId}&limit=${limit}&order_by=${orderBy}`
  );
  const json = await response.json();
  const newProposals: ProposalDetail[] = json.results
    .filter((p: IncomingProposal) => {
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
        proposalName: p.metadata?.title || null,
        description: p.metadata?.description || null,
        link: p.metadata?.url || null,
      };
    });

  return {
    response,
    mappedData: newProposals,
  };
};

export const ProposalsService = {
  listProposals,
};
