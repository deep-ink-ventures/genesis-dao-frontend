/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import { ProposalsService } from '@/services/proposals';

import type { GenesisState } from './genesisStore';

type DaoSlice = Pick<GenesisState['pages'], 'dao'>;

export const createDaoSlice: StateCreator<
  GenesisState & DaoSlice,
  [],
  [],
  DaoSlice
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
