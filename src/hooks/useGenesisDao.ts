import type { ISubmittableResult } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

import type {
  AssetDetails,
  CreateDaoData,
  WalletAccount,
} from '../stores/genesisStore';
import useGenesisStore, { TxnResponse } from '../stores/genesisStore';

// fixme open one connection and reuse that connection
const useGenesisDao = () => {
  const addTxnNotification = useGenesisStore((s) => s.addTxnNotification);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const apiConnection = useGenesisStore((s) => s.apiConnection);
  const fetchDaos = useGenesisStore((s) => s.fetchDaos);
  const updateNewCreatedDao = useGenesisStore((s) => s.updateNewCreatedDao);
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);

  // fixme currently only handles cancelled error
  const handleTxnError = (err: Error) => {
    let newNoti = {
      title: TxnResponse.Error,
      message: err.message,
      type: TxnResponse.Error,
      timestamp: Date.now(),
    };
    if (err.message.includes('Cancelled')) {
      newNoti = {
        title: TxnResponse.Cancelled,
        message:
          'Please try again. Make sure you sign and approve the transaction using your wallet',
        type: TxnResponse.Warning,
        timestamp: Date.now(),
      };
    }

    updateTxnProcessing(false);
    addTxnNotification(newNoti);
  };

  // fixme need to be able to separate txn types to send different response msgs
  const txResponseCallback = (
    result: ISubmittableResult,
    successMsg: string,
    errorMsg: string,
    successCB?: Function
  ) => {
    // eslint-disable-next-line
    console.log('Transaction status1:', result.status.type);
    console.log('txn', result);
    if (result.status.isInBlock) {
      // fixme need to get this block hash
      // eslint-disable-next-line
      console.log(
        'Included at block hash',
        result.status.asInBlock.toHex(),
        '\nwait for 10-20 seconds to finalize'
      );
      result.events.forEach(
        ({
          event: {
            data: [error],
            method,
          },
        }) => {
          const err = error as any;
          if (err?.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = apiConnection.registry.findMetaError(err.asModule);
            const string = `${decoded.section}.${decoded.method}}`;
            if (string.includes('AlreadyExists')) {
              console.log('This DAO ID already exists');
              const errorNoti = {
                title: `${TxnResponse.Error}`,
                message: 'This DAO ID already exists',
                type: TxnResponse.Error,
                txnHash: result.status.asInBlock.toHex(),
                timestamp: Date.now(),
              };
              addTxnNotification(errorNoti);
              updateTxnProcessing(false);
              return;
            }
          }

          if (method === 'ExtrinsicSuccess') {
            const successNoti = {
              title: `${TxnResponse.Success}`,
              message: successMsg,
              type: TxnResponse.Success,
              txnHash: result.status.asInBlock.toHex(),
              timestamp: Date.now(),
            };
            // add txn to our store - first index
            addTxnNotification(successNoti);
            successCB?.();
            updateTxnProcessing(false);
            return;
          }

          if (method === 'ExtrinsicFailed') {
            const errorNoti = {
              title: `${TxnResponse.Error}`,
              message: errorMsg,
              type: TxnResponse.Error,
              txnHash: result.status.asInBlock.toHex(),
              timestamp: Date.now(),
            };
            addTxnNotification(errorNoti);
            updateTxnProcessing(false);
          }
        }
      );
    } else if (result.status.isFinalized) {
      // eslint-disable-next-line
      console.log('Finalized block hash', result.status.asFinalized.toHex());
    }
  };

  // fixme I need to be able to see what error I get like duplicated daoId error
  const createDao = (
    walletAccount: WalletAccount,
    { daoId, daoName }: CreateDaoData
  ) => {
    if (walletAccount.signer) {
      updateTxnProcessing(true);
      apiConnection?.tx?.daoCore
        ?.createDao?.(daoId, daoName)
        .signAndSend?.(
          walletAccount.address,
          { signer: walletAccount.signer },
          (result) => {
            txResponseCallback(
              result,
              'Congrats! Your DAO is created.',
              'Something went wrong. Please try again.',
              () => {
                updateCreateDaoSteps(2);
              }
            );
            fetchDaos();
            updateNewCreatedDao({
              daoId,
              daoName,
              owner: walletAccount.address,
              assetId: null,
              owned: true,
            });
          }
        )
        .catch((err) => {
          handleTxnError(new Error(err));
          updateTxnProcessing(false);
        });
    } else {
      // fixme
      // eslint-disable-next-line
      console.log('wallet does not have a signer');
    }
  };

  const getAssetDetails = async (assetId: number) => {
    try {
      const result = await apiConnection.query.assets?.asset?.(assetId);
      const assetDetails = result?.toHuman() as unknown as AssetDetails;
      return assetDetails;
    } catch (err) {
      handleTxnError(err);
      return undefined;
    }
  };

  const destroyDao = (walletAccount: WalletAccount, daoId: string) => {
    if (walletAccount.signer) {
      apiConnection?.tx?.daoCore
        ?.destroyDao?.(daoId)
        .signAndSend(
          walletAccount.address,
          { signer: walletAccount.signer },
          (result) => {
            txResponseCallback(
              result,
              'DAO Destroyed. Bye Bye.',
              'Something went wrong. Please try again.'
            );
          }
        )
        .catch((err) => {
          updateTxnProcessing(false);
          handleTxnError(new Error(err));
        });
    } else {
      // fixme
      // eslint-disable-next-line
      console.log('wallet does not have a signer');
    }
  };

  const destroyDaoAndAssets = async (daoId: string, assetId: number | null) => {
    if (!currentWalletAccount) {
      return;
    }
    updateTxnProcessing(true);
    const nonce = await apiConnection.rpc.system.accountNextIndex(
      currentWalletAccount.address
    );

    if (!assetId) {
      destroyDao(currentWalletAccount, daoId);
    } else {
      apiConnection.tx.assets
        ?.startDestroy?.(assetId)
        .signAndSend(
          currentWalletAccount.address,
          { signer: currentWalletAccount.signer, nonce },
          (result) => {
            txResponseCallback(
              result,
              'Start destroying assets.',
              'Something went wrong. Please try again.',
              () => {
                // fixme need to check remaining accounts so we can run destroy again
                apiConnection.tx.assets?.destroyAccounts?.(assetId).signAndSend(
                  currentWalletAccount.address,
                  {
                    signer: currentWalletAccount.signer,
                    nonce: nonce.addn(1),
                  },
                  (destroyAccountsRes) => {
                    txResponseCallback(
                      destroyAccountsRes,
                      'Asset accounts destroyed',
                      'Something went wrong. Please try again.',
                      () => {
                        // fixme need to check remaining approvals so we can run destroy again
                        apiConnection.tx.assets
                          ?.destroyApprovals?.(assetId)
                          .signAndSend(
                            currentWalletAccount.address,
                            {
                              signer: currentWalletAccount.signer,
                              nonce: nonce.addn(2),
                            },
                            (destroyApprovalsRes) => {
                              txResponseCallback(
                                destroyApprovalsRes,
                                'Asset approvals destroyed',
                                'Something went wrong. Please try again.',
                                () => {
                                  apiConnection.tx.assets
                                    ?.finishDestroy?.(assetId)
                                    .signAndSend(
                                      currentWalletAccount.address,
                                      {
                                        signer: currentWalletAccount.signer,
                                        nonce: nonce.addn(3),
                                      },
                                      (finishDestroyRes) => {
                                        txResponseCallback(
                                          finishDestroyRes,
                                          'Finish destroying assets',
                                          'Something went wrong. Please try again.',
                                          () => {
                                            destroyDao(
                                              currentWalletAccount,
                                              daoId
                                            );
                                          }
                                        );
                                      }
                                    );
                                }
                              );
                            }
                          );
                      }
                    );
                  }
                );
              }
            );
          }
        )
        .catch((err) => {
          handleTxnError(err);
        })
        .finally(() => {
          updateTxnProcessing(false);
        });
    }
  };

  const destroyAssetAccounts = async (
    assetId: number,
    nonce?: BN,
    cb?: Function
  ) => {
    if (!currentWalletAccount) {
      return;
    }
    const nonceCount = nonce;
    const assetDetails = await getAssetDetails(assetId);
    if (assetDetails?.accounts === '0') {
      cb?.();
      return;
    }

    try {
      apiConnection.tx.assets?.destroyAccounts?.(assetId).signAndSend(
        currentWalletAccount.address,
        {
          signer: currentWalletAccount.signer,
          nonce: nonceCount,
        },
        (result) => {
          if (result.status.isInBlock) {
            getAssetDetails(assetId).then((asset) => {
              if (asset?.accounts !== '0') {
                destroyAssetAccounts(assetId, nonce, cb);
              } else {
                cb?.();
              }
            });
          }
          // check if all accounts are destroyed
        }
      );
    } catch (err) {
      handleTxnError(err);
    }
  };

  const destroyAssetApprovals = async (
    assetId: number,
    nonce?: BN,
    cb?: Function
  ) => {
    if (!currentWalletAccount) {
      return;
    }

    const assetDetails = await getAssetDetails(assetId);
    if (assetDetails?.approvals === '0') {
      cb?.();
      return;
    }

    try {
      apiConnection.tx.assets?.destroyApprovals?.(assetId).signAndSend(
        currentWalletAccount.address,
        {
          signer: currentWalletAccount.signer,
          nonce,
        },
        (result) => {
          // check if all accounts are destroyed
          if (result.status.isInBlock) {
            getAssetDetails(assetId).then((asset) => {
              if (asset?.approvals !== '0') {
                destroyAssetApprovals(assetId, nonce, cb);
              } else {
                cb?.();
              }
            });
          }
        }
      );
    } catch (err) {
      handleTxnError(err);
    }
  };

  const issueTokens = (
    walletAccount: WalletAccount,
    daoId: string,
    supply: number
  ) => {
    const amount = supply * 1000000000;
    if (walletAccount.signer) {
      apiConnection.tx?.daoCore
        ?.issueToken?.(daoId, amount)
        .signAndSend(
          walletAccount.address,
          { signer: walletAccount.signer },
          (result) => {
            txResponseCallback(
              result,
              'Tokens Issued',
              'Something went wrong. Please try again. '
            );
            fetchDaos();
          }
        )
        .then(() => {
          updateCreateDaoSteps(3);
        })
        .catch((err) => {
          updateTxnProcessing(false);
          handleTxnError(new Error(err));
        });
    } else {
      // eslint-disable-next-line
      console.log('wallet does not have a signer');
    }
  };

  const transfer = (
    walletAccount: WalletAccount,
    assetId: number,
    toAddress: string,
    amount: number
  ) => {
    const newAmount = amount * 1000000000;
    if (walletAccount.signer) {
      apiConnection.tx?.assets
        ?.transfer?.(assetId, toAddress, newAmount)
        .signAndSend(
          walletAccount.address,
          { signer: walletAccount.signer },
          (result) => {
            txResponseCallback(
              result,
              `Transferred ${amount}`,
              'Something went wrong. Please try again. '
            );
          }
        )
        .catch((err) => {
          updateTxnProcessing(false);
          handleTxnError(new Error(err));
        });
    } else {
      // fixme
      // eslint-disable-next-line
      console.log('no signer')
    }
  };

  const makeCreateDaoTxn = async (
    txns: any[],
    daoId: string,
    daoName: string,
    tokenSupply: number
  ) => {
    const amount = tokenSupply * 1000000000;
    const api = apiConnection;
    const createDaoTxn = api.tx.daoCore?.createDao?.(daoId, daoName);
    const issueTokensTxn = api.tx.daoCore?.issueTokens?.(daoId, amount);

    return [...txns, createDaoTxn, issueTokensTxn];
  };

  const sendMultipleTxns = async (
    walletAccount: WalletAccount,
    txns: any[],
    successMsg: string,
    errorMsg: string
  ) => {
    if (walletAccount.signer) {
      apiConnection.tx.utility
        ?.batch?.(txns)
        .signAndSend(
          walletAccount.address,
          { signer: walletAccount.signer },
          (result) => {
            txResponseCallback(result, successMsg, errorMsg);
          }
        )
        .catch((err) => {
          updateTxnProcessing(false);
          handleTxnError(new Error(err));
        });
    }
  };

  return {
    createDao,
    destroyDao,
    issueTokens,
    handleTxnError,
    transfer,
    sendMultipleTxns,
    makeCreateDaoTxn,
    destroyDaoAndAssets,
    destroyAssetAccounts,
    destroyAssetApprovals,
  };
};

export default useGenesisDao;
