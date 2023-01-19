import type { GenesisStore } from './genesisStore';

export const walletAccountSelector = (state: GenesisStore) =>
  state.currentWalletAccount;

export const multipleAccountsSelector = (state: GenesisStore) =>
  state.walletAccounts;
