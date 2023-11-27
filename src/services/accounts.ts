import { SERVICE_URL } from '@/config';
import type { Account } from '@/types/account';

interface RawAccount {
  address: string;
  delegate_address?: string;
  balance: {
    free: number;
    reserved: number;
    frozen: number;
    flags: number;
  };
}

const transformToAccount = (data: RawAccount): Account => ({
  address: data.address,
  delegateAddress: data.delegate_address,
  balance: data.balance,
});

const get = async (address: string) => {
  try {
    const response = await fetch(`${SERVICE_URL}/accounts/${address}`);
    const objResponse = await response.json();

    if (!objResponse?.address) {
      return null;
    }

    return transformToAccount(objResponse as RawAccount);
  } catch (err) {
    throw Error('Cannot fetch account');
  }
};

export const AccountService = {
  get,
};
