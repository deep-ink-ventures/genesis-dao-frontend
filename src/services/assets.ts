import type { BN } from '@polkadot/util';

import { SERVICE_URL } from '@/config';
import type { Paginated } from '@/types/response';
import { camelToSnakeCase } from '@/utils';
import { convertToBN } from '@/utils/number';
import { keysToCamelCase } from '@/utils/transformer';

interface ListAssetsQueryParams {
  limit?: number;
  offset?: number;
  ordering?: 'id' | 'owner_id' | 'asset_id';
  assetId?: string;
  ownerId?: string;
}

interface RawAsset {
  dao_id: string;
  id: number;
  owner_id: string;
  total_supply: number;
}

export interface Asset {
  daoId: string;
  id: number;
  ownerId: string;
  totalSupply: number;
}

interface RawAssetHolding {
  asset_id: number;
  balance: number;
  id: number;
  owner_id: string;
}

export interface AssetHolding {
  assetId: number;
  balance: BN;
  id: number;
  ownerId: string;
}

const listAssetHoldings = async (params?: ListAssetsQueryParams) => {
  try {
    const query = Object.entries(params || {})
      .filter(([, v]) => v?.toString()?.length)
      ?.map((value) => [camelToSnakeCase(value[0]), value[1]]);

    const queryString = new URLSearchParams(query);

    const response = await fetch(
      `${SERVICE_URL}/asset-holdings/?${queryString.toString()}`
    );

    const objResponse = await response.json();
    if (!objResponse?.results?.[0]) {
      return null;
    }

    const data = objResponse as Paginated<RawAssetHolding[]>;

    const formattedAssetHoldings: AssetHolding[] = data.results?.map((item) => {
      const formattedAssetHolding = keysToCamelCase(item);

      return {
        ...formattedAssetHolding,
        balance: convertToBN(formattedAssetHolding.balance),
      };
    });

    return {
      ...data,
      results: formattedAssetHoldings,
    } as Paginated<AssetHolding[]>;
  } catch (err) {
    throw Error('Cannot fetch asset holdings');
  }
};

const listAssets = async (params?: ListAssetsQueryParams) => {
  const query = Object.entries(params || {})
    .filter(([, v]) => v?.toString()?.length)
    ?.map((value) => [camelToSnakeCase(value[0]), value[1]]);

  const queryString = new URLSearchParams(query);

  const response = await fetch(
    `${SERVICE_URL}/assets/?${queryString?.toString()}`
  );

  const objResponse = await response.json();

  const data = objResponse as Paginated<RawAsset[]>;

  const formattedAssets: Asset[] = data.results?.map((item) =>
    keysToCamelCase<RawAsset>(item)
  );

  return {
    ...data,
    results: formattedAssets,
  } as Paginated<Asset[]>;
};

const getAsset = async (assetId: string) => {
  const response = await fetch(`${SERVICE_URL}/assets/${assetId}`);

  const objResponse = await response.json();

  const formattedAsset: Asset = keysToCamelCase<RawAsset>(objResponse);

  return formattedAsset;
};

export const AssetsHoldingsService = {
  listAssets,
  getAsset,
  listAssetHoldings,
};
