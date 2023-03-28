import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { createKeyMulti } from '@polkadot/util-crypto';

// @ts-ignore
export const truncateMiddle = (str?, start = 4, end = 4) => {
  if (str && str.length) {
    if (str.length <= start + end) {
      return str;
    }
    return `${str.substring(0, start)}...${
      end > 0 ? str.substring(str.length - end) : ''
    }`;
  }
  return '';
};

/* eslint-disable */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isValidPolkadotAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch {
    return false;
  }
};

export const getMultisigAddress = (signerAddresses: string[], threshold: number = 1) => {
  for( const addy of signerAddresses) {
    if(!isValidPolkadotAddress(addy)) {
      return
    }
  }
  const multiAddress = createKeyMulti(signerAddresses, threshold);
  const Ss58Address = encodeAddress(multiAddress, 42); //Subtrate address

  return Ss58Address
}