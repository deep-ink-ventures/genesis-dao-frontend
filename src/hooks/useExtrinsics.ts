import type { u128 } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import type {
  CreateDaoData,
  DaoInfo,
  IncomingDaoInfo,
  WalletAccount,
} from '../stores/genesisStore';
import useGenesisStore, { TxnResponse } from '../stores/genesisStore';
import useApiPromise from './useApiPromise';

const useExtrinsics = () => {
  const { apiPromise } = useApiPromise();
  const addTxnNotification = useGenesisStore((s) => s.addTxnNotification);
  const txnNotifications = useGenesisStore((s) => s.txnNotifications);

  const txResponseCallback = (result: ISubmittableResult) => {
    console.log('Transaction status:', result.status.type);

    if (result.status.isInBlock) {
      // fixme need to get this block hash
      console.log('Included at block hash', result.status.asInBlock.toHex());

      console.log('Events:');

      result.events.forEach(({ event: { data, method, section }, phase }) => {
        if (method === 'ExtrinsicSuccess') {
          const successNoti = {
            title: `${TxnResponse.Success} DAO Created`,
            message: 'Congrats! Your DAO has been created!',
            result: TxnResponse.Success,
            txnHash: result.status.asInBlock.toHex(),
          };
          // add txn to our store - first index
          addTxnNotification(successNoti);
          // this is where we trigger txn success modal
          console.log('TXN is gucci');
        }
        if (method === 'ExtrinsicFailed') {
          const errorNoti = {
            title: `${TxnResponse.Error} DAO Was Not Created`,
            message: `Oops, there has been error. Please try again. `,
            result: TxnResponse.Error,
            txnHash: result.status.asInBlock.toHex(),
          };
          addTxnNotification(errorNoti);
          // fixme
          console.log('TXN FAILED');
        }
        console.log(
          '\t',
          phase.toString(),
          `: ${section}.${method}`,
          data.toString()
        );
      });
    } else if (result.status.isFinalized) {
      console.log('Finalized block hash', result.status.asFinalized.toHex());
      console.log(txnNotifications);
    }
  };

  const createDao = (
    walletAccount: WalletAccount,
    { daoId, daoName }: CreateDaoData
  ) => {
    if (walletAccount.signer) {
      apiPromise
        .then(async (api) => {
          api?.tx?.daoCore
            ?.createDao?.(daoId, daoName)
            .signAndSend?.(
              walletAccount.address,
              { signer: walletAccount.signer },
              txResponseCallback
            )
            .catch((err) => {
              // fixme
              console.log(new Error(err));
            });
        })
        .catch((err) => {
          // fixme
          console.log(err);
          throw new Error(err);
        });
    } else {
      // fixme
      console.log('wallet does not have a signer');
    }
  };

  const getDaos = () => {
    const daos: DaoInfo[] = [];
    apiPromise
      .then((api) => {
        api?.query?.daoCore?.daos
          ?.entries()
          .then((daoEntries) => {
            daoEntries.forEach(([_k, v]) => {
              const dao = v.toHuman() as unknown as IncomingDaoInfo;
              const newObj = {
                daoId: dao.id,
                daoName: dao.name,
                owner: dao.owner,
                assetId: dao.assetId,
              };
              daos.push(newObj);
            });
          })
          .catch((err) => {
            console.log(new Error(err));
          });
      })
      .catch((err) => {
        console.log(new Error(err));
      });
    return daos;
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
            )
            .catch((err) => {
              console.log(new Error(err));
            });
        })
        .catch((err) => {
          console.log(new Error(err));
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
            )
            .catch((err) => {
              console.log(new Error(err));
            });
        })
        .catch((err) => {
          console.log(new Error(err));
        });
    } else {
      console.log('wallet does not have a signer');
    }
  };

  return { createDao, destroyDao, issueToken, getDaos };
};

export default useExtrinsics;
