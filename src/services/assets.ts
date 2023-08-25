import { SERVICE_URL } from '@/config';
import type { Paginated } from '@/types/response';

interface ListAssetsQueryParams {
  limit?: number;
  offset?: number;
  ordering?: 'id' | 'owner_id' | 'asset_id';
  search?: string;
  asset_id?: string;
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
  try {
    const query = Object.fromEntries(
      Object.entries(params || {}).filter(([, v]) => v != null)
    );

    const queryString = new URLSearchParams(query);

    const response = await fetch(
      `${SERVICE_URL}/asset-holdings/?${queryString.toString()}`
    );

    const objResponse = await response.json();
    if (!objResponse?.results?.[0]) {
      return null;
    }

    return objResponse as Paginated<AssetHolding[]>;
  } catch (err) {
    throw Error('Cannot fetch asset holdings');
  }
};

const getAssetHolding = async (assetId: string) => {
  try {
    // fixme. Should not use assetId
    const response = await fetch(`${SERVICE_URL}/asset-holdings/${assetId}`);

    const objResponse = await response.json();
    if (!objResponse.asset_id) {
      return null;
    }
    return objResponse as AssetHolding;
  } catch (err) {
    throw Error('Cannot fetch asset holding');
  }
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

const getAsset = async (assetId: string) => {
  const response = await fetch(`${SERVICE_URL}/assets/${assetId}`);

  const objResponse = await response.json();

  return objResponse as Asset;
};

export const AssetsHoldingsService = {
  listAssets,
  getAsset,
  getAssetHolding,
  listAssetHoldings,
};
