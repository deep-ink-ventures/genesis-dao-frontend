import type { BN } from '@polkadot/util';

export interface CouncilMember {
  name: string;
  walletAddress: string;
}

export interface TokenRecipient {
  walletAddress: string;
  tokens: BN; // this is before adding DAO units
}

export interface CouncilTokensValues
  extends CouncilFormValues,
    IssueTokensValues {
  isFinished: false;
}

export interface CouncilFormValues {
  creatorName: string;
  creatorWallet: string;
  councilMembers: CouncilMember[];
  councilThreshold: number; // number of councils needed to approve
}

export interface IssueTokensValues {
  tokenRecipients: TokenRecipient[];
  treasuryTokens: BN;
}
