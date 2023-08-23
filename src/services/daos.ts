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
  console.log('dao objResponse', objResponse);
  return objResponse as Paginated<RawDao[]>;
};

export const DaoService = {
  get,
  list,
};
