export interface IncomingTokenBalanceData {
  balance: string;
  extra: string | null;
  reason: string;
  reserved: string; // number string
}

export interface IssueTokensData {
  daoId: string;
  supply: number; // fixme change this to BN
}
