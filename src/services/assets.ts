import { SERVICE_URL } from '@/config';
import type { Paginated } from '@/types/response';

interface ListAssetsQueryParams {
  limit?: number;
  offset?: number;
  ordering?: 'id' | 'owner_id' | 'asset_id';
  search?: string;
}

export interface Asset {
  dao_id: string;
  id: number;
  owner_id: string;
  total_supply: number;
}

export interface AssetHolding {
  asset_id: number;
  balance: number;
  id: number;
  owner_id: string;
}

const listAssetHoldings = async (params?: ListAssetsQueryParams) => {
  const query = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v != null)
  );

  const queryString = new URLSearchParams(query);

  const response = await fetch(
    `${SERVICE_URL}/asset-holdings/?${queryString.toString()}`
  );

  const objResponse = await response.json();

  return objResponse as Paginated<AssetHolding[]>;
};

const listAssets = async (params?: ListAssetsQueryParams) => {
  const query = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v != null)
  );

  const queryString = new URLSearchParams(query);

  const response = await fetch(
    `${SERVICE_URL}/assets/?${queryString?.toString()}`
  );

  const objResponse = await response.json();

  return objResponse as Paginated<Asset[]>;
};

export const AssetsHoldingsService = {
  listAssets,
  listAssetHoldings,
};
