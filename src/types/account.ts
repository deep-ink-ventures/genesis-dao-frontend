export interface Account {
  address: string;
  delegateAddress?: string; // TODO: check once available in API
  balance: {
    free: number;
    reserved: number;
    frozen: number;
    flags: number;
  };
}
