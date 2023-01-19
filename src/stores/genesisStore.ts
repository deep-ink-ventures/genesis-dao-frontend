import type { Wallet } from '@talismn/connect-wallets';
import { create } from 'zustand';

export interface WalletAccount {
  address: string;
  source: string;
  name?: string;
  wallet?: Wallet;
  signer?: unknown;
}

export interface GenesisState {
  currentWalletAccount: WalletAccount | undefined;
  walletAccounts: WalletAccount[] | undefined;
  walletConnected: boolean;
}

export interface GenesisActions {
  updateCurrentWalletAccount: (
    currentWalletAccount: WalletAccount | undefined
  ) => void;
  updateWalletAccounts: (walletAccounts: WalletAccount[] | undefined) => void;
  updateWalletConnected: (walletConnected: boolean) => void;
}

export interface GenesisStore extends GenesisState, GenesisActions {}

const useGenesisStore = create<GenesisStore>()((set) => ({
  currentWalletAccount: undefined,
  walletAccounts: undefined,
  walletConnected: false,
  updateCurrentWalletAccount: (currentWalletAccount) =>
    set(() => ({ currentWalletAccount })),
  updateWalletAccounts: (walletAccounts) => set(() => ({ walletAccounts })),
  updateWalletConnected: (walletConnected) => set(() => ({ walletConnected })),
}));

export default useGenesisStore;
