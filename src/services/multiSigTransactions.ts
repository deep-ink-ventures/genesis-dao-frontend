import { SERVICE_URL } from '@/config';
import type { MultiSigTransaction } from '@/types/multiSigTransaction';
import type { Paginated } from '@/types/response';
import { camelToSnakeCase } from '@/utils';
import { transformMultiSigTxnToCamelCase } from '@/utils/transformer';

export interface RawMultiSigTransaction {
  id: number;
  multisig_address: string;
  dao_id?: string | null;
  call?: {
    hash?: string | null;
    module?: string | null;
    function?: string | null;
    args?: Record<string, any> | null;
  } | null;
  call_hash: string;
  corresponding_models?: {
    asset?: {
      id?: number | null;
      dao_id?: string | null;
      owner_id?: string | null;
      total_supply?: number | null;
    } | null;
    dao?: {
      id?: string | null;
      name?: string | null;
      creator_id?: string | null;
      owner_id?: string | null;
      asset_id?: number | null;
      proposal_duration?: number | null;
      proposal_token_deposit?: number | null;
      minimum_majority_per_1024?: number | null;
      setup_complete?: boolean | null;
      metadata?: Record<string, any> | null;
      metadata_url?: string | null;
      metadata_hash?: string | null;
      number_of_token_holders?: number | null;
      number_of_open_proposals?: number | null;
      most_recent_proposals?: string | null;
    } | null;
    proposal?: {
      id?: number | null;
      dao_id?: string | null;
      creator_id?: string | null;
      status?: string | null;
      fault?: string | null;
      votes?: {
        pro?: number | null;
        contra?: number | null;
        abstained?: number | null;
        total?: number | null;
      } | null;
      metadata?: Record<string, any> | null;
      metadata_url?: string | null;
      metadata_hash?: string | null;
      birth_block_number?: number | null;
      setup_complete?: boolean | null;
    } | null;
  };
  status: string;
  threshold?: number | null;
  approvers: string[] | null;
  last_approver?: string | null;
  executed_at?: string | null;
  canceled_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListMultiSigTxnsQueryParams {
  search?: string;
  ordering?: string;
  limit?: number;
  offset?: number;
}

// fixme waiting to for service to add back filter by dao_id
// const get = async (address: string) => {
//   const response = await fetch(`${SERVICE_URL}/multisig-transactions/${address}`);

//   const objResponse = (await response.json()) as RawMultiSigTransaction;

//   return transformToMultiSig(objResponse);
// };

const list = async (params?: ListMultiSigTxnsQueryParams) => {
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
    `${SERVICE_URL}/multisig-transactions/?${queryString.toString()}`
  );

  const objResponse = await response?.json();

  const multiSigTransactions = objResponse?.results?.map(
    (rawMultiSigTxn: RawMultiSigTransaction) => {
      return transformMultiSigTxnToCamelCase(rawMultiSigTxn);
    }
  );

  const paginated = Object.assign(objResponse, {
    results: multiSigTransactions,
  });

  return paginated as Paginated<MultiSigTransaction[]>;
};

export const MultiSigTransactionsService = {
  list,
};
