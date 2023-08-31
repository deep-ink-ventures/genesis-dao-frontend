// import useGenesisDao from '@/hooks/useGenesisDao';
import { BN } from '@polkadot/util';
import { sortAddresses } from '@polkadot/util-crypto';
import Modal from 'antd/lib/modal';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import { MultiSigsService } from '@/services/multiSigs';
import type { MultiSigTxnBody } from '@/services/multiSigTransactions';
import useGenesisStore from '@/stores/genesisStore';
import type { TokenRecipient } from '@/types/council';

import { DistributeTokensForm } from './DistributeTokensForm';

interface TransferAssetFormValues {
  tokenRecipients: TokenRecipient[];
}

const TransferTreasuryAsset = () => {
  const {
    makeBatchTransferTxn,
    makeMultiSigTxnAndSend,
    makeBatchTxn,
    postMultiSigTxn,
  } = useGenesisDao();

  const [threshold, setThreshold] = useState<number>();

  const [createApiConnection, apiConnection, updateTxnProcessing] =
    useGenesisStore((s) => [
      s.createApiConnection,
      s.apiConnection,
      s.updateTxnProcessing,
    ]);

  const [
    currentDao,
    fetchDaoFromDB,
    currentWalletAccount,
    txnProcessing,
    handleErrors,
    daoTokenTreasuryBalance,
  ] = useGenesisStore((s) => [
    s.currentDao,
    s.fetchDaoFromDB,
    s.currentWalletAccount,
    s.txnProcessing,
    s.handleErrors,
    s.daoTokenTreasuryBalance,
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const formMethods = useForm<TransferAssetFormValues>({
    defaultValues: {
      tokenRecipients: [
        {
          walletAddress: '',
          tokens: new BN(0),
        },
      ],
    },
  });

  const { handleSubmit, reset } = formMethods;

  const handleTransferAsset = () => {
    setIsOpen(true);
  };

  const onSubmit: SubmitHandler<TransferAssetFormValues> = async (data) => {
    if (!currentWalletAccount || !currentDao?.daoId) {
      handleErrors(
        `Sorry we've run into some issues related to the multisig account`
      );
      return;
    }
    if (!threshold) {
      handleErrors(`Error in getting multisig threshold`);
      return;
    }

    const recipients = data.tokenRecipients.map((recipient) => {
      return {
        walletAddress: recipient.walletAddress,
        tokens: recipient.tokens,
      };
    });

    const withRecipients = makeBatchTransferTxn(
      [],
      recipients,
      Number(currentDao.daoAssetId)
    );

    const signatories = sortAddresses([
      ...currentDao.adminAddresses.filter((address) => {
        return address !== currentWalletAccount.address;
      }),
    ]);

    const tx = makeBatchTxn(withRecipients);

    if (!tx) {
      handleErrors('Cannot get batch transaction');
      return;
    }
    const callHash = tx.method.hash.toHex();
    const callData = tx.method.toHex();
    const timepoint = {
      height: 1025,
      index: 1,
    };

    makeMultiSigTxnAndSend(tx, threshold, signatories, () => {
      updateTxnProcessing(true);

      const body: MultiSigTxnBody = {
        hash: callHash,
        module: 'Assets',
        function: 'transfer_keep_alive',
        args: {
          id: currentDao?.daoAssetId,
          target: recipients[0]?.walletAddress,
          amount: recipients[0]?.tokens.toString(),
        },
        data: callData,
        timepoint,
      };

      postMultiSigTxn(currentDao.daoId, body).then(() => {
        updateTxnProcessing(false);
        setIsOpen(false);
        fetchDaoFromDB(currentDao?.daoId);
        reset();
      });
    }).catch((err) => {
      handleErrors('MultiSig Transaction Error', err);
      updateTxnProcessing(false);
      setIsOpen(false);
    });
  };

  useEffect(() => {
    if (!apiConnection) {
      createApiConnection();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getThreshold = async () => {
      if (!currentDao) {
        return;
      }
      try {
        const multiSig = await MultiSigsService.get(
          currentDao?.daoOwnerAddress
        );
        if (multiSig) {
          setThreshold(multiSig?.threshold);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    getThreshold();
  }, [currentDao, handleErrors]);

  return (
    <>
      <div className='flex justify-center'>
        <button
          className={`btn btn-primary w-[180px] ${
            txnProcessing ? 'loading' : ''
          }`}
          disabled={!currentWalletAccount}
          onClick={handleTransferAsset}>
          Transfer Asset
        </button>
      </div>
      <Modal
        open={isOpen}
        wrapClassName='a-modal-bg'
        className='a-modal'
        onCancel={() => {
          setIsOpen(false);
        }}
        footer={null}
        width={615}
        zIndex={99}>
        <FormProvider {...formMethods}>
          <div className='mb-6'>
            <h3 className='text-center text-primary'>{currentDao?.daoName}</h3>
            <div className='text-center text-xl'>
              Transfer tokens from your treasury to other accounts
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-5 flex w-full flex-col items-center justify-center gap-y-6 border-none hover:brightness-100'>
              <DistributeTokensForm multiple={false} />
            </div>
            <div className='mt-6 flex w-full justify-end'>
              <button
                className={`btn btn-primary mr-3 w-48 ${
                  daoTokenTreasuryBalance?.isZero() ? 'btn-disabled' : ''
                } ${txnProcessing ? 'loading' : ''}`}
                type='submit'>
                {`${txnProcessing ? 'Processing' : 'Approve and Sign'}`}
              </button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default TransferTreasuryAsset;
