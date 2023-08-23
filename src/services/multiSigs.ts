import { SERVICE_URL } from '@/config';
import type { MultiSig } from '@/types/multiSigs';
import { camelToSnakeCase, isValidPolkadotAddress } from '@/utils';

import type { Paginated } from '../types/response';

interface RawMultiSig {
  address: string;
  dao_id: string;
  signatories: string[];
  threshold: number;
}

interface ListMultiSigsQueryParams {
  search?: string;
  ordering?: string;
  limit?: number;
  offset?: number;
}

const transformToMultiSig = (data: RawMultiSig): MultiSig => ({
  address: data.address,
  daoId: data.dao_id, 
  signatories: data.signatories,
  threshold: data.threshold,
});

const get = async (address: string) => {
  const response = await fetch(`${SERVICE_URL}/multisigs/${address}`);

  const objResponse = (await response.json()) as RawMultiSig;

  return transformToMultiSig(objResponse);
};

const list = async (params?: ListMultiSigsQueryParams) => {
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
    `${SERVICE_URL}/multisigs/?${queryString.toString()}`
  );

  const objResponse = (await response?.json()) as unknown as Paginated<
    RawMultiSig[]
  >;

  const multiSigs = objResponse.results.map((rawMultiSig) => {
    return transformToMultiSig(rawMultiSig);
  });

  const paginated = Object.assign(objResponse, { results: multiSigs });

  return paginated as Paginated<MultiSig[]>;
};

/**
 *
 * @param signatories Ss58 Substrate Addresses
 * @param threshold
 */
const create = async (signatories: string[], threshold: number) => {
  signatories.forEach((address) => {
    if (!isValidPolkadotAddress(address)) {
      throw Error('Not valid polkadot address');
    }
  });
  if (threshold > signatories.length) {
    throw Error('Threshold number exceeds signatories number');
  }

  const body = JSON.stringify({
    signatories,
    threshold,
  });
  const response = await fetch(
    `${SERVICE_URL}/multisigs/`,

    {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const multiSig = response.json();
  return multiSig;
};

export const MultiSigsService = {
  list,
  get,
  create,
};
