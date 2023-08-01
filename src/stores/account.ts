/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import type { Asset, AssetHolding } from '@/services/assets';
import { AssetsHoldingsService } from '@/services/assets';
import type { Dao } from '@/services/daos';
import { DaoService } from '@/services/daos';

import type { GenesisState } from './genesisStore';

export type AccountSlice = {
  assets: {
    loading: boolean;
    data: Array<Asset & { dao?: Dao }>;
    fetchAssets: () => void;
    selectedAssetHolding:
      | (AssetHolding & { asset?: Asset & { dao?: Dao } })
      | null;
    selectAssetHolding: (
      assetHolding?: (AssetHolding & { asset?: Asset & { dao?: Dao } }) | null
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
    assets: {
      loading: false,
      data: [],
      fetchAssets: () => {
        set(
          produce((state: GenesisState) => {
            state.pages.account.assets.loading = true;
          })
        );
        AssetsHoldingsService.listAssets()
          .then(async (response) => {
            let newData: Array<Asset & { dao?: Dao }> = [];
            if (response.results?.length) {
              const daoDetails = await Promise.all(
                response.results.map((asset) => DaoService.get(asset.dao_id))
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
      },
    },
  },
});
