export interface Paginated<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
}

export enum TxnResponse {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Warning = 'WARNING',
  Cancelled = 'CANCELLED',
}
