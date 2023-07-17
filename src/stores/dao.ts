/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import type { ProposalDetail } from '@/services/proposals';
import { ProposalsService } from '@/services/proposals';

import type { GenesisState } from './genesisStore';

export type DaoSlice = {
  transactions: {
    loading: boolean;
    data: Array<ProposalDetail>;
    fetchTransactions: (params?: {
      dao_id?: string;
      limit?: number;
      order_by?: string;
    }) => Promise<void>;
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
        ProposalsService.listProposals(params);
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
          })
        );
      },
    },
  },
});
