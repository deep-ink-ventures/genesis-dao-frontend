/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import type { ListMultiSigTxnsQueryParams } from '@/services/multiSigTransactions';
import { MultiSigTransactionsService } from '@/services/multiSigTransactions';
import type { ListProposalsQueryParams } from '@/services/proposals';
import { ProposalsService } from '@/services/proposals';
import type { MultiSigTransaction } from '@/types/multiSigTransaction';
import type { ProposalDetail } from '@/types/proposal';

import type { GenesisState } from './genesisStore';

export type DaoSlice = {
  transactions: {
    loading: boolean;
    data: Array<ProposalDetail>;
    totalCount?: number;
    fetchTransactions: (params?: ListProposalsQueryParams) => Promise<void>;
  };
  multiSigTransactions: {
    loading: boolean;
    data: Array<MultiSigTransaction>;
    totalCount?: number;
    fetchMultiSigTransactions: (
      params?: ListMultiSigTxnsQueryParams
    ) => Promise<void>;
  };
};

export const createDaoSlice: StateCreator<
  GenesisState,
  [],
  [],
  { dao: DaoSlice }
> = (set) => ({
  dao: {
    transactions: {
      loading: false,
      data: [],
      fetchTransactions: async (params) => {
        set(
          produce((state: GenesisState) => {
            state.pages.dao.transactions.loading = true;
          })
        );
        const response = await ProposalsService.listProposals(params);
        set(
          produce((state: GenesisState) => {
            state.pages.dao.transactions.data = response.mappedData;
            state.pages.dao.transactions.loading = false;
            state.pages.dao.transactions.totalCount = response.data.count;
          })
        );
      },
    },
    multiSigTransactions: {
      loading: false,
      data: [],
      fetchMultiSigTransactions: async (params) => {
        set(
          produce((state: GenesisState) => {
            state.pages.dao.transactions.loading = true;
          })
        );
        const response = await MultiSigTransactionsService.list(params);
        set(
          produce((state: GenesisState) => {
            state.pages.dao.multiSigTransactions.data = response.results;
            state.pages.dao.multiSigTransactions.loading = false;
            state.pages.dao.multiSigTransactions.totalCount = response.count;
          })
        );
      },
    },
  },
});
