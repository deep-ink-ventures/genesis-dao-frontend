import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { BN, formatBalance, hexToU8a, isHex } from '@polkadot/util';
import { createKeyMulti } from '@polkadot/util-crypto';

import { DAO_UNITS, NATIVE_UNITS } from '@/config';

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
  for (const addy of signerAddresses) {
    if(!isValidPolkadotAddress(addy)) {
      return
    }
  }
  const multiAddress = createKeyMulti(signerAddresses, threshold);
  //https://polkadot.js.org/docs/keyring/start/ss58/
  const Ss58Address = encodeAddress(multiAddress, 42); //Subtrate address

  return Ss58Address
}

export const readFileAsB64 = (file: File) =>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result?.toString().split(',')[1];
      if (b64) {
        resolve(b64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}


export function hexToBase64(hexStr:string) {
  let base64 = "";
  for(let i = 0; i < hexStr.length; i++) {
    base64 += !(i - 1 & 1) ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16)) : ""
  }
  return window.btoa(base64);
}

export const getProposalEndTime = (currentNumber: number, startNumber: number, durationNumber: number) => {
  const leftOverNumber = durationNumber - (currentNumber - startNumber);
  
  const seconds = leftOverNumber * 6;
  const day = Math.floor(seconds / (3600*24));
  const hour = Math.floor(seconds % (3600*24) / 3600);
  const minute = Math.floor(seconds % 3600 / 60);

  const d = day > 0 ? day : 0
  const h = hour > 0 ? hour : 0
  const m = minute > 0 ? minute : 0
  
  return {
    d,
    h,
    m
  }
}


export const uiTokens = (
  rawAmount: BN | null 
  | undefined,
  tokenUnit: 'native' | 'dao' | 'none',
  unitName?: string
) => {
  let units: number = 1;
  
  if(tokenUnit === 'native') {
    units = NATIVE_UNITS
  } 

  if(tokenUnit === 'dao') {
    units = DAO_UNITS
  }

  formatBalance.setDefaults({ decimals: 0, unit: unitName || 'UNITS' });

  return formatBalance(rawAmount?.div(new BN(units)).toString(), {
    forceUnit: unitName,
    withZero: false,
  });
};

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);