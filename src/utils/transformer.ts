import type { Dao } from '@/services/daos';
import type { DaoDetail } from '@/types/dao';

export const transformDaoToDaoDetail = (dao: Dao) => {
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
