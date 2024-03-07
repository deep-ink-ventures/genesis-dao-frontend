import { SERVICE_URL } from '@/config';
import type { Paginated } from '@/types/response';
import { camelToSnakeCase } from '@/utils';

export interface RawDao {
  id: string;
  name: string;
  creator_id: string;
  owner_id: string;
  asset_id: number;
  proposal_duration: number;
  proposal_token_deposit: number;
  minimum_majority_per_1024: number;
  setup_complete: boolean;
  metadata_url: string;
  metadata_hash: string;
  metadata?: Metadata;
  number_of_token_holders: number;
  number_of_open_proposals: number;
  most_recent_proposals: string[];
  ink_asset_contract: string;
  ink_registry_contract: string;
  ink_vesting_wallet_contract: string;
  ink_vote_escrow_contract: string;
}

export interface Metadata {
  email?: string;
  images?: Images;
  description_long?: string;
  description_short?: string;
}

export interface Images {
  logo?: Logo;
}

export interface Logo {
  large: Image;
  small: Image;
  medium: Image;
  content_type?: string;
}

export interface Image {
  url?: string;
}

export interface ListDaosQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  search?: string;
}

export interface InitializeContractsParams {
  daoId: string;
  validatedSignature: string;
}

const get = async (daoId: string) => {
  const response = await fetch(`${SERVICE_URL}/daos/${daoId}`);

  const objResponse = await response.json();

  return objResponse as RawDao;
};

const list = async (params?: ListDaosQueryParams) => {
  let queryEntries = Object.entries(params || {}).filter(
    ([, v]) => v?.toString()?.length
  );

  queryEntries = queryEntries.map((value) => [
    camelToSnakeCase(value[0]),
    value[1],
  ]);

  const query = Object.fromEntries(queryEntries);

  const queryString = new URLSearchParams(query);

  const response = await fetch(
    `${SERVICE_URL}/daos/?${queryString.toString()}`
  );

  const objResponse = await response?.json();
  return objResponse as Paginated<RawDao[]>;
};

const initializeContracts = async ({
  daoId,
  validatedSignature,
}: InitializeContractsParams) => {
  try {
    const response = await fetch(
      `${SERVICE_URL}/daos/${daoId}/initiate-contracts/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Signature: validatedSignature,
        },
      }
    );
    const obj = await response.json();
    return obj;
  } catch (ex) {
    throw new Error('Cannot initiate dao contracts');
  }
};

export const DaoService = {
  get,
  list,
  initializeContracts,
};
