import type { RawDao } from '@/services/daos';
import type { RawMultiSigTransaction } from '@/services/multiSigTransactions';
import type { DaoDetail } from '@/types/dao';
import type { MultiSigTransaction } from '@/types/multiSigTransaction';

export const transformDaoToDaoDetail = (dao: RawDao) => {
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
      contentType: dao.metadata?.images?.logo?.content_type || null,
      small: dao.metadata?.images?.logo?.small.url || null,
      medium: dao.metadata?.images?.logo?.medium.url || null,
      large: dao.metadata?.images?.logo?.medium.url || null,
    },
  } as DaoDetail;
};

export const transformMultiSigTxnToCamelCase = (
  input: RawMultiSigTransaction
): MultiSigTransaction => {
  return {
    id: input.id,
    multisigAddress: input.multisig_address,
    daoId: input.dao_id,
    call: input.call
      ? {
          hash: input.call.hash,
          module: input.call.module,
          function: input.call.function,
          args: input.call.args,
        }
      : null,
    callHash: input.call_hash,
    correspondingModels: input.corresponding_models
      ? {
          asset: input.corresponding_models.asset
            ? {
                id: input.corresponding_models.asset.id,
                daoId: input.corresponding_models.asset.dao_id,
                ownerId: input.corresponding_models.asset.owner_id,
                totalSupply: input.corresponding_models.asset.total_supply,
              }
            : null,
          dao: input.corresponding_models.dao
            ? {
                id: input.corresponding_models.dao.id,
                name: input.corresponding_models.dao.name,
                creatorId: input.corresponding_models.dao.creator_id,
                ownerId: input.corresponding_models.dao.owner_id,
                assetId: input.corresponding_models.dao.asset_id,
                proposalDuration:
                  input.corresponding_models.dao.proposal_duration,
                proposalTokenDeposit:
                  input.corresponding_models.dao.proposal_token_deposit,
                minimumMajorityPer1024:
                  input.corresponding_models.dao.minimum_majority_per_1024,
                setupComplete: input.corresponding_models.dao.setup_complete,
                metadata: input.corresponding_models.dao.metadata,
                metadataUrl: input.corresponding_models.dao.metadata_url,
                metadataHash: input.corresponding_models.dao.metadata_hash,
                numberOfTokenHolders:
                  input.corresponding_models.dao.number_of_token_holders,
                numberOfOpenProposals:
                  input.corresponding_models.dao.number_of_open_proposals,
                mostRecentProposals:
                  input.corresponding_models.dao.most_recent_proposals,
              }
            : null,
          proposal: input.corresponding_models.proposal
            ? {
                id: input.corresponding_models.proposal.id,
                daoId: input.corresponding_models.proposal.dao_id,
                creatorId: input.corresponding_models.proposal.creator_id,
                status: input.corresponding_models.proposal.status,
                fault: input.corresponding_models.proposal.fault,
                votes: input.corresponding_models.proposal.votes,
                metadata: input.corresponding_models.proposal.metadata,
                metadataUrl: input.corresponding_models.proposal.metadata_url,
                metadataHash: input.corresponding_models.proposal.metadata_hash,
                birthBlockNumber:
                  input.corresponding_models.proposal.birth_block_number,
                setupComplete:
                  input.corresponding_models.proposal.setup_complete,
              }
            : null,
        }
      : undefined,
    status: input.status,
    threshold: input.threshold,
    approvers: input.approvers,
    lastApprover: input.last_approver,
    executedAt: input.executed_at,
    canceledBy: input.canceled_by,
    createdAt: input.created_at,
    updatedAt: input.updated_at,
  };
};
