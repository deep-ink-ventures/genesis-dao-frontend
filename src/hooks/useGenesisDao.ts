import type { SubmittableExtrinsicFunction } from '@polkadot/api-base/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import { stringToHex } from '@polkadot/util';
import { useRouter } from 'next/router';

import { DAO_UNITS, SERVICE_URL } from '@/config';
import type { AssetDetails } from '@/types/asset';
import type { TokenRecipient } from '@/types/council';
import type { ProposalCreationValues } from '@/types/proposal';
import { TxnResponse } from '@/types/response';
import { hexToBase64 } from '@/utils';

import type { CreateDaoData, WalletAccount } from '../stores/genesisStore';
import useGenesisStore from '../stores/genesisStore';

// fixme open one connection and reuse that connection
const useGenesisDao = () => {
  const router = useRouter();
  const [
    currentWalletAccount,
    apiConnection,
    addTxnNotification,
    updateTxnProcessing,
    fetchDaoFromDB,
    handleErrors,
    updateCreateDaoSteps,
    updateIsStartModalOpen,
    updateDaoPage,
    updateProposalValue,
    updateIsFaultyModalOpen,
    fetchDaoTokenBalance,
  ] = useGenesisStore((s) => [
    s.currentWalletAccount,
    s.apiConnection,
    s.addTxnNotification,
    s.updateTxnProcessing,
    s.fetchDaoFromDB,
    s.handleErrors,
    s.updateCreateDaoSteps,
    s.updateIsStartModalOpen,
    s.updateDaoPage,
    s.updateProposalValues,
    s.updateIsFaultyModalOpen,
    s.fetchDaoTokenBalance,
  ]);
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
    // eslint-disable-next-line
    console.error(err)
    updateTxnProcessing(false);
    addTxnNotification(newNoti);
  };

  // fixme need to be able to separate txn types to send different response msgs
  const txResponseCallback = (
    result: ISubmittableResult,
    successMsg: string,
    errorMsg: string,
    successCB?: Function,
    waitForFinalized?: boolean
  ) => {
    if (waitForFinalized) {
      let success = false;
      result.events.forEach(({ event: { method } }) => {
        if (method === 'ExtrinsicSuccess') {
          success = true;
        }
      });
      if (result.status.isFinalized) {
        if (success) {
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
        }
        updateTxnProcessing(false);
      }
      return;
    }
    // eslint-disable-next-line
    console.log('Transaction status1:', result.status.type);
    if (result.status.isInBlock) {
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
            const decoded = apiConnection?.registry.findMetaError(err.asModule);
            const string = `${decoded?.section}.${decoded?.method}}`;
            if (string.includes('AlreadyExists')) {
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

          if (method === 'DaoCreated') {
            setTimeout(() => {
              successCB?.();
              updateTxnProcessing(false);
            }, 4000);
            return;
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
            setTimeout(() => {
              addTxnNotification(successNoti);
              successCB?.();
              updateTxnProcessing(false);
            }, 3000);

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
              `Congrats! ${daoName} is created.`,
              'Something went wrong. Please try again.',
              () => {
                setTimeout(() => {
                  fetchDaoFromDB(daoId as string);
                  updateCreateDaoSteps(1);
                  updateIsStartModalOpen(false);
                  router.push(`/dao/${daoId}/customize`);
                }, 1000);
              }
            );
          }
        )
        .catch((err) => {
          handleTxnError(new Error(err));
          updateTxnProcessing(false);
        });
    } else {
      handleErrors('wallet does not have a signer');
    }
  };

  const getAssetDetails = async (assetId: number) => {
    try {
      const result = await apiConnection?.query.assets?.asset?.(assetId);
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
              'Something went wrong. Please try again.',
              () => {
                router.push('/');
              }
            );
          }
        )
        .catch((err) => {
          updateTxnProcessing(false);
          handleTxnError(new Error(err));
        });
    } else {
      handleErrors('wallet does not have a signer');
    }
  };

  const destroyDaoAndAssets = async (daoId: string, assetId: number | null) => {
    if (!currentWalletAccount) {
      return;
    }
    updateTxnProcessing(true);
    const nonce = await apiConnection?.rpc.system.accountNextIndex(
      currentWalletAccount.address
    );

    if (!assetId) {
      destroyDao(currentWalletAccount, daoId);
    } else {
      apiConnection?.tx.assets
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
                    nonce: nonce?.addn(1),
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
                              nonce: nonce?.addn(2),
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
                                        nonce: nonce?.addn(3),
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
      apiConnection?.tx.assets?.destroyAccounts?.(assetId).signAndSend(
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
      apiConnection?.tx.assets?.destroyApprovals?.(assetId).signAndSend(
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
    const amount = supply * DAO_UNITS;
    if (walletAccount.signer) {
      apiConnection?.tx?.daoCore
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
      handleErrors('wallet does not have a signer');
    }
  };

  const transfer = (
    walletAccount: WalletAccount,
    assetId: number,
    toAddress: string,
    amount: BN,
    onStart?: () => void,
    onSuccess?: () => void
  ) => {
    if (walletAccount.signer) {
      if (onStart) {
        onStart();
      }
      apiConnection?.tx?.assets
        ?.transferKeepAlive?.(assetId, toAddress, amount)
        .signAndSend(
          walletAccount.address,
          { signer: walletAccount.signer },
          (result) => {
            txResponseCallback(
              result,
              `Transferred Successfully`,
              'Something went wrong. Please try again. ',
              () => {
                setTimeout(() => {
                  fetchDaoTokenBalance(assetId, walletAccount.address);
                }, 2000);
              }
            );
            if (onSuccess) {
              onSuccess();
            }
          }
        )
        .catch((err) => {
          updateTxnProcessing(false);
          handleTxnError(new Error(err));
        });
    } else {
      handleErrors('no signer');
    }
  };

  const makeCreateDaoTxn = (txns: any[], daoId: string, daoName: string) => {
    const createDaoTxn = apiConnection?.tx.daoCore?.createDao?.(daoId, daoName);

    return [...txns, createDaoTxn];
  };

  const makeIssueTokensTxn = (txns: any[], daoId: string, tokenSupply: BN) => {
    const issueTokensTxn = apiConnection?.tx?.daoCore?.issueToken?.(
      daoId,
      tokenSupply
    );

    return [...txns, issueTokensTxn];
  };

  const makeBatchTransferTxn = (
    txns: any[],
    recipients: TokenRecipient[],
    assetId: number
  ): SubmittableExtrinsicFunction<'promise'>[] => {
    const transferTxns = recipients.map((recipient) => {
      return apiConnection?.tx.assets?.transfer?.(
        Number(assetId),
        recipient.walletAddress,
        recipient.tokens
      );
    });

    const newTxns = [...txns, ...transferTxns];
    return newTxns;
  };

  const sendBatchTxns = async (
    txns: SubmittableExtrinsicFunction<'promise'>[],
    successMsg: string,
    errorMsg: string,
    successCb?: Function
  ) => {
    updateTxnProcessing(true);
    if (currentWalletAccount?.signer) {
      apiConnection?.tx.utility
        ?.batchAll?.(txns)
        .signAndSend(
          currentWalletAccount.address,
          { signer: currentWalletAccount.signer },
          (result) => {
            txResponseCallback(result, successMsg, errorMsg, successCb);
          }
        )
        .catch((err) => {
          updateTxnProcessing(false);
          handleTxnError(new Error(err));
        });
    }
  };

  const setGovernanceMajorityVote = (
    daoId: string,
    voteDurationBlocks: number,
    deposit: number,
    minimumMajority: number
  ) => {
    if (!currentWalletAccount) {
      return;
    }

    updateTxnProcessing(true);

    apiConnection?.tx?.votes
      ?.setGovernanceMajorityVote?.(
        daoId,
        voteDurationBlocks,
        deposit,
        minimumMajority
      )
      .signAndSend(
        currentWalletAccount.address,
        { signer: currentWalletAccount.signer },
        (result) => {
          txResponseCallback(
            result,
            'Governance Model Set Up Successfully',
            'Governance Setup Transaction Failed',
            () => {
              updateCreateDaoSteps(2);
            }
          );
        }
      )
      .catch((err) => {
        updateTxnProcessing(false);
        handleTxnError(new Error(err));
      });
  };

  const makeMajorityVoteTxn = (
    txns: any[],
    daoId: string,
    voteDurationBlocks: number,
    deposit: number,
    minimumMajority: number
  ) => {
    return [
      ...txns,
      apiConnection?.tx?.votes?.setGovernanceMajorityVote?.(
        daoId,
        voteDurationBlocks,
        deposit,
        minimumMajority
      ),
    ];
  };

  const makeSetMetadataTxn = (
    txns: any[],
    daoId: string,
    meta: string,
    hash: string
  ) => {
    return [
      ...txns,
      apiConnection?.tx?.daoCore?.setMetadata?.(daoId, meta, hash),
    ];
  };

  const makeChangeOwnerTxn = (
    txns: any[],
    daoId: string,
    newOwnerAddress: string
  ) => {
    return [
      ...txns,
      apiConnection?.tx?.daoCore?.changeOwner?.(daoId, newOwnerAddress),
    ];
  };

  const makeCreateProposalTxn = (txns: any[], daoId: string) => {
    return [...txns, apiConnection?.tx?.votes?.createProposal?.(daoId)];
  };

  const makeSetProposalMetadataTxn = (
    txns: any[],
    proposalId: string,
    metadataUrl: string,
    metadataHash: string
  ) => {
    return [
      ...txns,
      apiConnection?.tx?.votes?.setMetadata?.(
        proposalId,
        metadataUrl,
        metadataHash
      ),
    ];
  };

  const makeVoteTxn = (txns: any[], proposalId: string, inFavor: boolean) => {
    return [...txns, apiConnection?.tx?.votes?.vote?.(proposalId, inFavor)];
  };

  const makeFinalizeProposalTxn = (txns: any[], proposalId: string) => {
    return [...txns, apiConnection?.tx?.votes?.finalizeProposal?.(proposalId)];
  };

  const makeFaultProposalTxn = (
    txns: any[],
    proposalId: string,
    reason: string
  ) => {
    return [
      ...txns,
      apiConnection?.tx?.votes?.faultProposal?.(proposalId, reason),
    ];
  };

  const markImplementedTxn = (txns: any[], proposalId: string) => {
    return [...txns, apiConnection?.tx?.votes?.markImplemented?.(proposalId)];
  };

  const doChallenge = async (daoId: string) => {
    try {
      const challengeRes = await fetch(
        `${SERVICE_URL}/daos/${daoId}/challenge/`
      );
      const challengeString = await challengeRes.json();
      if (!challengeString.challenge) {
        handleErrors('Error in retrieving ownership-validation challenge');
        return null;
      }
      const signerResult = await currentWalletAccount?.signer?.signRaw?.({
        address: currentWalletAccount.address,
        data: stringToHex(challengeString.challenge),
        type: 'bytes',
      });

      if (!signerResult) {
        handleErrors('Not able to validate ownership');
        return null;
      }

      return hexToBase64(signerResult.signature.substring(2));
    } catch (err) {
      handleErrors(err);
      return null;
    }
  };
  const setProposalMetadata = async (
    daoId: string,
    proposalId: string,
    proposalValues: ProposalCreationValues
  ) => {
    try {
      const jsonData = JSON.stringify({
        title: proposalValues?.title,
        description: proposalValues?.description,
        url: proposalValues?.url,
      });
      const sig = await doChallenge(daoId);
      if (!sig) {
        handleErrors('Verification Challenge failed');
        return;
      }

      const metadataResponse = await fetch(
        `${SERVICE_URL}/proposals/${proposalId}/metadata/`,
        {
          method: 'POST',
          body: jsonData,
          headers: {
            'Content-Type': 'application/json',
            Signature: sig,
          },
        }
      );

      const metadata = await metadataResponse.json();
      if (!metadata?.metadata_url) {
        handleErrors(`Not able to upload metadata Status:${metadata?.status}`);
        return;
      }
      const txns = makeSetProposalMetadataTxn(
        [],
        proposalId,
        metadata.metadata_url,
        metadata.metadata_hash
      );

      await sendBatchTxns(
        txns,
        'Proposal Created!',
        'Transaction failed',
        () => {
          updateTxnProcessing(false);
          updateDaoPage('proposals');
          updateProposalValue(null);
          router.push(`/dao/${daoId}`);
        }
      );
    } catch (err) {
      handleErrors(err);
      updateTxnProcessing(false);
    }
  };

  const createAProposal = async (
    daoId: string,
    proposalValues: ProposalCreationValues
  ) => {
    let proposalSuccess = false;
    updateTxnProcessing(true);
    if (!currentWalletAccount) {
      handleErrors('Wallet not connected');
      return;
    }
    apiConnection?.tx?.votes
      ?.createProposal?.(daoId)
      .signAndSend?.(
        currentWalletAccount.address,
        { signer: currentWalletAccount.signer },
        (result) => {
          let proposalId = '';
          result.events.forEach(({ event: { data, method } }) => {
            if (method === 'ProposalCreated' && !proposalSuccess) {
              // so we only run setProposalMetadata once
              proposalSuccess = true;
              setTimeout(() => {
                setProposalMetadata(daoId, proposalId, proposalValues);
              }, 3000);
              proposalId = data[2]?.toHuman() as string;
            }
          });
        }
      )
      .catch((err) => {
        handleErrors(err);
        updateTxnProcessing(false);
      });
  };

  const reportFaultyProposal = async (
    daoId: string,
    proposalId: string,
    reason: string
  ) => {
    updateTxnProcessing(true);

    try {
      const jsonData = JSON.stringify({
        proposal_id: proposalId,
        reason,
      });
      const sig = await doChallenge(daoId);
      if (!sig) {
        handleErrors('Verification Challenge failed');
        return;
      }

      const faultyProposalResponse = await fetch(
        `${SERVICE_URL}/proposals/${proposalId}/report-faulted/`,
        {
          method: 'POST',
          body: jsonData,
          headers: {
            'Content-Type': 'application/json',
            Signature: sig,
          },
        }
      );

      const res = await faultyProposalResponse.json();
      if (res?.reason?.detail?.includes('report maximum has already been')) {
        handleErrors(res.reason.detail);
      }

      if (!res?.reason) {
        handleErrors(`Not able to report faulty proposal: ${res?.detail}`);
        return;
      }
      updateIsFaultyModalOpen(false);
      updateTxnProcessing(false);
      const successNoti = {
        title: `${TxnResponse.Success}`,
        message: 'Your faulty proposal report has been submitted. Thank you!',
        type: TxnResponse.Success,
        timestamp: Date.now(),
      };
      addTxnNotification(successNoti);
    } catch (err) {
      handleErrors(err);
      updateIsFaultyModalOpen(false);
      updateTxnProcessing(false);
      const errNoti = {
        title: `${TxnResponse.Error}`,
        message: 'There was an issue submitted the report. Please try again. ',
        type: TxnResponse.Error,
        timestamp: Date.now(),
      };
      addTxnNotification(errNoti);
    }
  };

  return {
    createDao,
    destroyDao,
    issueTokens,
    handleTxnError,
    transfer,
    sendBatchTxns,
    makeCreateDaoTxn,
    destroyDaoAndAssets,
    destroyAssetAccounts,
    destroyAssetApprovals,
    setGovernanceMajorityVote,
    makeIssueTokensTxn,
    makeBatchTransferTxn,
    makeMajorityVoteTxn,
    makeSetMetadataTxn,
    makeChangeOwnerTxn,
    makeCreateProposalTxn,
    makeVoteTxn,
    makeFinalizeProposalTxn,
    makeFaultProposalTxn,
    markImplementedTxn,
    makeSetProposalMetadataTxn,
    doChallenge,
    createAProposal,
    setProposalMetadata,
    reportFaultyProposal,
  };
};

export default useGenesisDao;
