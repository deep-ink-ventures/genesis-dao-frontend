/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import { AccountService } from '@/services/accounts';
import type { Asset, AssetHolding } from '@/services/assets';
import { AssetsHoldingsService } from '@/services/assets';
import type { RawDao } from '@/services/daos';
import { DaoService } from '@/services/daos';
import type { Account } from '@/types/account';

import type { GenesisState } from './genesisStore';

export type AccountSlice = {
  account: {
    data: Account | null;
    loading: boolean;
    fetchAccount: (address: string) => void;
  };
  assets: {
    loading: boolean;
    data: Array<Asset & { dao?: RawDao }>;
    fetchAssets: () => void;
    selectedAssetHolding:
      | (AssetHolding & { asset?: Asset & { dao?: RawDao } })
      | null;
    selectAssetHolding: (
      assetHolding?:
        | (AssetHolding & { asset?: Asset & { dao?: RawDao } })
        | null
    ) => void;
  };
  tabs: {
    activeTab?: string;
    setActiveTab: (tab: string) => void;
  };
  modals: {
    transferAssets: {
      visible: boolean;
      setVisibility: (open: boolean) => void;
      txnProcessing?: boolean;
      setTxnProcessing: (isProcessing?: boolean) => void;
    };
    delegate: {
      visible: boolean;
      setVisibility: (open: boolean) => void;
      txnProcessing?: boolean;
      setTxnProcessing: (isProcessing?: boolean) => void;
    };
    revokeDelegate: {
      visible: boolean;
      setVisibility: (open: boolean) => void;
      txnProcessing?: boolean;
      setTxnProcessing: (isProcessing?: boolean) => void;
    };
  };
};

export const createAccountSlice: StateCreator<
  GenesisState,
  [],
  [],
  { account: AccountSlice }
> = (set, get) => ({
  account: {
    account: {
      data: null,
      loading: false,
      fetchAccount: (address: string) => {
        set(
          produce((state: GenesisState) => {
            state.pages.account.account.loading = true;
            state.pages.account.account.data = null;
          })
        );
        AccountService.get(address)
          .then(async (response) => {
            if (response) {
              set(
                produce((state: GenesisState) => {
                  state.pages.account.account.data = response;
                })
              );
            }
          })
          .finally(() => {
            set(
              produce((state: GenesisState) => {
                state.pages.account.account.loading = false;
              })
            );
          });
      },
    },
    assets: {
      loading: false,
      data: [],
      fetchAssets: () => {
        set(
          produce((state: GenesisState) => {
            state.pages.account.assets.loading = true;
            state.pages.account.assets.data = [];
          })
        );
        AssetsHoldingsService.listAssets()
          .then(async (response) => {
            let newData: Array<Asset & { dao?: RawDao }> = [];
            if (response.results?.length) {
              const daoDetails = await Promise.all(
                response.results.map((asset) => DaoService.get(asset.daoId))
              );
              newData = response.results.map((asset) => ({
                ...asset,
                dao: daoDetails.find((dao) => dao.asset_id === asset.id),
              }));
            }
            set(
              produce((state: GenesisState) => {
                state.pages.account.assets.data = newData;
              })
            );
          })
          .finally(() => {
            set(
              produce((state: GenesisState) => {
                state.pages.account.assets.loading = false;
              })
            );
          });
      },
      selectedAssetHolding: null,
      selectAssetHolding: (asset) => {
        set(
          produce((state: GenesisState) => {
            state.pages.account.assets.selectedAssetHolding = asset || null;
          })
        );
      },
    },
    tabs: {
      setActiveTab: (tab) =>
        set(
          produce((state: GenesisState) => {
            state.pages.account.tabs.activeTab = tab;
          })
        ),
    },
    modals: {
      transferAssets: {
        visible: false,
        setVisibility: (open: boolean) => {
          set(
            produce((state: GenesisState) => {
              state.pages.account.modals.transferAssets.visible = open;
            })
          );
          if (!open) {
            get().pages.account.assets.selectAssetHolding(null);
          }
        },
        txnProcessing: false,
        setTxnProcessing: (isProcessing?: boolean) => {
          set(
            produce((state: GenesisState) => {
              state.pages.account.modals.transferAssets.txnProcessing =
                isProcessing;
            })
          );
        },
      },
      delegate: {
        visible: false,
        setVisibility: (open: boolean) => {
          set(
            produce((state: GenesisState) => {
              state.pages.account.modals.delegate.visible = open;
            })
          );
          if (!open) {
            get().pages.account.assets.selectAssetHolding(null);
          }
        },
        txnProcessing: false,
        setTxnProcessing: (isProcessing?: boolean) => {
          set(
            produce((state: GenesisState) => {
              state.pages.account.modals.delegate.txnProcessing = isProcessing;
            })
          );
        },
      },
      revokeDelegate: {
        visible: false,
        setVisibility: (open: boolean) => {
          set(
            produce((state: GenesisState) => {
              state.pages.account.modals.revokeDelegate.visible = open;
            })
          );
          if (!open) {
            get().pages.account.assets.selectAssetHolding(null);
          }
        },
        txnProcessing: false,
        setTxnProcessing: (isProcessing?: boolean) => {
          set(
            produce((state: GenesisState) => {
              state.pages.account.modals.revokeDelegate.txnProcessing =
                isProcessing;
            })
          );
        },
      },
    },
  },
});
