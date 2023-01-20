import type { u128 } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import type { CreateDaoData, WalletAccount } from '../stores/genesisStore';
import useApiPromise from './useApiPromise';

// enum TxnResponse {
//   Successful = 'SUCCESSFUL',
//   Failed = 'FAILED',
//   Cancelled = 'CANCELLED',
// }

const useExtrinsics = () => {
  const { apiPromise } = useApiPromise();

  const txResponseCallback = (result: ISubmittableResult) => {
    console.log('Transaction status:', result.status.type);

    if (result.status.isInBlock) {
      console.log('Included at block hash', result.status.asInBlock.toHex());
      console.log('Events:');

      result.events.forEach(({ event: { data, method, section }, phase }) => {
        console.log(
          '\t',
          phase.toString(),
          `: ${section}.${method}`,
          data.toString()
        );
      });
    } else if (result.status.isFinalized) {
      console.log('Finalized block hash', result.status.asFinalized.toHex());
    }
  };

  const createDao = async (
    walletAccount: WalletAccount,
    { daoId, daoName }: CreateDaoData
  ) => {
    if (walletAccount.signer) {
      apiPromise
        .then((api) => {
          api?.tx?.daoCore
            ?.createDao?.(daoId, daoName)
            .signAndSend(
              walletAccount.address,
              { signer: walletAccount.signer },
              txResponseCallback
            );
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
    } else {
      console.log('wallet does not have a signer');
    }
  };

  const destroyDao = (walletAccount: WalletAccount, daoId: string) => {
    if (walletAccount.signer) {
      apiPromise
        .then((api) => {
          api?.tx?.daoCore
            ?.destroyDao?.(daoId)
            .signAndSend(
              walletAccount.address,
              { signer: walletAccount.signer },
              txResponseCallback
            );
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
    } else {
      console.log('wallet does not have a signer');
    }
  };

  const issueToken = (
    walletAccount: WalletAccount,
    daoId: string,
    supply: u128
  ) => {
    if (walletAccount.signer) {
      apiPromise
        .then((api) => {
          api?.tx?.daoCore
            ?.issueToken?.(daoId, supply)
            .signAndSend(
              walletAccount.address,
              { signer: walletAccount.signer },
              txResponseCallback
            );
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
    } else {
      console.log('wallet does not have a signer');
    }
  };

  return { createDao, destroyDao, issueToken };
};

export default useExtrinsics;
